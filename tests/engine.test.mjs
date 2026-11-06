import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateConstraint, evaluateBoard, findSolutions, getHint } from '../app/src/main/assets/www/engine.js';
import { LEVELS } from '../app/src/main/assets/www/levels.js';
import { analyzeDifficulty } from '../scripts/analyze-difficulty.mjs';

test('constraint arithmetic and incomplete status', () => {
  assert.equal(evaluateConstraint({ kind: 'sum', cells: [0, 1, 2], target: 15 }, [2, 8, 5]).status, 'satisfied');
  assert.equal(evaluateConstraint({ kind: 'product', cells: [0, 1, 2], target: 72 }, [2, 9, 4]).value, 72);
  assert.equal(evaluateConstraint({ kind: 'difference', cells: [0, 1], target: 5 }, [2, 7]).status, 'satisfied');
  assert.equal(evaluateConstraint({ kind: 'ratio', cells: [0, 1], target: 3 }, [9, 3]).status, 'satisfied');
  assert.equal(evaluateConstraint({ kind: 'ratio', cells: [0, 1], target: 1.5 }, [2, 3]).status, 'satisfied');
  assert.deepEqual(evaluateConstraint({ kind: 'sum', cells: [0, 1], target: 3 }, [1, null]), { status: 'pending', value: null, complete: false });
  assert.equal(evaluateConstraint({ kind: 'sum', cells: [0, 1], target: 3 }, [2, 2]).status, 'violated');
});

test('board rejects duplicate, foreign and extra cards', () => {
  const level = LEVELS[0];
  assert.deepEqual(evaluateBoard(level, [1, 1, null, null]).invalidCells.sort(), [0, 1]);
  assert.equal(evaluateBoard(level, [8, null, null, null]).valid, false);
  assert.equal(evaluateBoard(level, [...level.solution, 99]).solved, false);
  assert.equal(evaluateBoard(level, [null, null, null, null]).complete, false);
  assert.equal(evaluateBoard(level, level.solution).solved, true);
});

test('solver respects fixed cells, detects no solutions, and respects limit', () => {
  const simple = { size: 2, digits: [1, 2], constraints: [{ id: 'sum', kind: 'sum', cells: [0, 1], target: 3 }] };
  assert.equal(findSolutions(simple).length, 2);
  assert.equal(findSolutions(simple, { limit: 1 }).length, 1);
  assert.deepEqual(findSolutions(simple, { board: [2, null] }), [[2, 1]]);
  assert.deepEqual(findSolutions(simple, { board: [1, 1] }), []);
  assert.deepEqual(findSolutions(simple, { board: [1, 2, 3] }), []);
  assert.deepEqual(findSolutions({ ...simple, constraints: [{ id: 'bad', kind: 'sum', cells: [0, 1], target: 8 }] }), []);
  assert.deepEqual(findSolutions(simple, { limit: 0 }), []);
});

test('level progression and agreed fourth level are preserved', () => {
  assert.equal(LEVELS.length, 30);
  assert.deepEqual(LEVELS.map(level => level.id), Array.from({ length: 30 }, (_, index) => index + 1));
  assert.equal(LEVELS.filter(level => level.tier === 'tutorial').length, 3);
  assert.equal(LEVELS.filter(level => level.tier === 'normal').length, 18);
  assert.equal(LEVELS.filter(level => level.tier === 'challenge').length, 9);
  const fourth = LEVELS[3];
  assert.deepEqual(fourth.solution, [2, 8, 5, 9, 3, 1, 4, 6, 7]);
  assert.deepEqual(fourth.constraints.filter(constraint => constraint.id.startsWith('row')).map(constraint => constraint.target), [15, 13, 17]);
  assert.deepEqual(fourth.constraints.filter(constraint => constraint.id.startsWith('col')).map(constraint => constraint.target), [72, 144, 35]);
  assert.equal(fourth.constraints.find(constraint => constraint.id === 'cross-diagonal').target, 12);
});

for (const level of LEVELS) {
  test(`level ${level.id} has exactly one valid solution`, () => {
    assert.equal(new Set(level.digits).size, level.digits.length);
    assert.equal(level.solution.length, level.digits.length);
    assert.equal(level.digits.length % level.size, 0);
    assert.equal(new Set(level.constraints.map(constraint => constraint.id)).size, level.constraints.length);
    for (const constraint of level.constraints) {
      assert.ok(constraint.cells.length >= 2);
      assert.equal(new Set(constraint.cells).size, constraint.cells.length);
      assert.ok(constraint.cells.every(cell => Number.isInteger(cell) && cell >= 0 && cell < level.digits.length));
      if (constraint.kind === 'difference' || constraint.kind === 'ratio') assert.equal(constraint.cells.length, 2);
    }
    assert.equal(evaluateBoard(level, level.solution).solved, true);
    const withoutAnswer = { ...level, solution: undefined };
    assert.deepEqual(findSolutions(withoutAnswer), [level.solution]);
    const partial = level.solution.map((value, index) => index % 2 ? null : value);
    assert.deepEqual(findSolutions(withoutAnswer, { board: partial }), [level.solution]);
    assert.ok(level.hints.length >= 2);
    for (const hint of level.hints) assert.ok(hint.cells.every(cell => cell >= 0 && cell < level.digits.length));
  });
}

test('hints prioritize mistakes and single-missing-cell reasoning', () => {
  const level = LEVELS[3];
  assert.equal(getHint(level, [2, 2, null, null, null, null, null, null, null]).kind, 'conflict');
  assert.equal(getHint(level, [1, 2, 3, null, null, null, null, null, null]).kind, 'conflict');
  const impossiblePartial = getHint(level, [7, 8, null, null, null, null, null, null, null]);
  assert.equal(impossiblePartial.kind, 'conflict');
  assert.match(impossiblePartial.text, /剩余数字卡已经无法满足/);
  const hint = getHint(level, [2, 8, null, null, null, null, null, null, null]);
  assert.equal(hint.kind, 'deduction');
  assert.match(hint.text, /目标和/);
  assert.equal(getHint(level, level.solution).kind, 'complete');
  assert.equal(getHint(level, Array(9).fill(null)).kind, 'strategy');
});

test('difficulty tiers have an explicit reasoning-model baseline', () => {
  const baseline = analyzeDifficulty(LEVELS[3]);
  assert.equal(baseline.solutions, 1);
  assert.equal(baseline.forcedCells, 3);
  assert.equal(baseline.firstSolutionDepth, 1);
  for (const level of LEVELS.filter(candidate => candidate.tier === 'tutorial')) {
    const metrics = analyzeDifficulty(level);
    assert.equal(metrics.branches, 0, `Tutorial ${level.id} must have a direct propagation path`);
    assert.equal(metrics.forcedCells, level.digits.length);
  }
  for (const level of LEVELS.filter(candidate => candidate.tier === 'challenge')) {
    const metrics = analyzeDifficulty(level);
    assert.equal(metrics.solutions, 1);
    assert.ok(metrics.forcedCells < baseline.forcedCells, `Challenge ${level.id} should leave more unresolved positions`);
    assert.ok(metrics.remainingCandidates > baseline.remainingCandidates, `Challenge ${level.id} should need more cross-clue reasoning`);
    assert.ok(metrics.firstSolutionDepth >= baseline.firstSolutionDepth);
    if ([25, 26, 28].includes(level.id)) assert.ok(metrics.firstSolutionDepth > baseline.firstSolutionDepth);
  }
});

test('challenge levels use sparse cross-region constraints rather than full row and column templates', () => {
  for (const level of LEVELS.filter(candidate => candidate.tier === 'challenge')) {
    assert.ok(level.constraints.filter(constraint => constraint.id.startsWith('cross')).length >= 3);
    assert.ok(level.constraints.filter(constraint => constraint.id.startsWith('row') || constraint.id.startsWith('col')).length <= 2);
  }
});

test('independent full-permutation enumeration confirms every level is unique', () => {
  // No solver pruning and no engine arithmetic: catches over-aggressive solver
  // pruning that could otherwise incorrectly certify the generated levels.
  for (const level of LEVELS) {
    const permutation = level.digits.slice();
    let count = 0;
    let answer;
    function visit(start) {
      if (start === permutation.length) {
        for (const clue of level.constraints) {
          const values = clue.cells.map(cell => permutation[cell]);
          let result;
          if (clue.kind === 'sum') result = values.reduce((a, b) => a + b, 0);
          if (clue.kind === 'product') result = values.reduce((a, b) => a * b, 1);
          if (clue.kind === 'difference') result = Math.abs(values[0] - values[1]);
          if (clue.kind === 'ratio') result = Math.max(values[0], values[1]) / Math.min(values[0], values[1]);
          if (Math.abs(result - clue.target) > 1e-9) return;
        }
        count += 1;
        answer = permutation.slice();
        return;
      }
      for (let index = start; index < permutation.length; index += 1) {
        [permutation[start], permutation[index]] = [permutation[index], permutation[start]];
        visit(start + 1);
        [permutation[start], permutation[index]] = [permutation[index], permutation[start]];
      }
    }
    visit(0);
    assert.equal(count, 1, `Independent count for level ${level.id}`);
    assert.deepEqual(answer, level.solution);
  }
});
