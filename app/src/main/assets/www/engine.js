// Math rules are shared by the Android UI, level generator and Node checks.
const EPSILON = 1e-9;
const isEmpty = value => value === null || value === undefined || value === '';
const equal = (a, b) => Math.abs(a - b) <= EPSILON * Math.max(1, Math.abs(a), Math.abs(b));

export function constraintValue(constraint, values) {
  switch (constraint.kind) {
    case 'sum': return values.reduce((sum, value) => sum + value, 0);
    case 'product': return values.reduce((product, value) => product * value, 1);
    case 'difference': return Math.abs(values[0] - values[1]);
    case 'ratio': return Math.max(...values) / Math.min(...values);
    default: throw new Error(`Unknown constraint kind: ${constraint.kind}`);
  }
}

export function evaluateConstraint(constraint, board) {
  const values = constraint.cells.map(cell => board[cell]);
  if (values.some(isEmpty)) return { status: 'pending', value: null, complete: false };
  const value = constraintValue(constraint, values);
  return { status: Number.isFinite(value) && equal(value, constraint.target) ? 'satisfied' : 'violated', value, complete: true };
}

export function evaluateBoard(level, board) {
  const invalidCells = [];
  const occupied = new Map();
  for (let index = 0; index < level.digits.length; index += 1) {
    const value = board[index];
    if (isEmpty(value)) continue;
    if (!level.digits.includes(value)) invalidCells.push(index);
    if (occupied.has(value)) invalidCells.push(index, occupied.get(value));
    else occupied.set(value, index);
  }
  if (board.length > level.digits.length) {
    for (let index = level.digits.length; index < board.length; index += 1) if (!isEmpty(board[index])) invalidCells.push(index);
  }
  const constraints = level.constraints.map(constraint => ({ id: constraint.id, ...evaluateConstraint(constraint, board) }));
  const complete = level.digits.every((_, index) => !isEmpty(board[index]));
  const valid = invalidCells.length === 0 && constraints.every(constraint => constraint.status !== 'violated');
  return { complete, solved: complete && valid, valid, constraints, invalidCells: [...new Set(invalidCells)] };
}

function hasCombination(values, count, target, kind, start = 0) {
  if (count === 0) return equal(target, kind === 'sum' ? 0 : 1);
  if (values.length - start < count) return false;
  if (kind === 'sum' && target <= 0) return false;
  if (kind === 'product' && target < 1 - EPSILON) return false;
  for (let index = start; index <= values.length - count; index += 1) {
    const next = kind === 'sum' ? target - values[index] : target / values[index];
    if (kind === 'product' && !equal(next, Math.round(next))) continue;
    if (hasCombination(values, count - 1, next, kind, index + 1)) return true;
  }
  return false;
}

function constraintPossible(constraint, board, remaining) {
  const assigned = constraint.cells.map(cell => board[cell]).filter(value => !isEmpty(value));
  const missing = constraint.cells.length - assigned.length;
  if (!missing) return equal(constraintValue(constraint, assigned), constraint.target);
  if (constraint.kind === 'sum' || constraint.kind === 'product') {
    const known = constraintValue(constraint, assigned);
    const target = constraint.kind === 'sum' ? constraint.target - known : constraint.target / known;
    return hasCombination(remaining, missing, target, constraint.kind);
  }
  if (missing === 1) return remaining.some(value => equal(constraintValue(constraint, assigned.concat(value)), constraint.target));
  for (let first = 0; first < remaining.length; first += 1) {
    for (let second = first + 1; second < remaining.length; second += 1) {
      if (equal(constraintValue(constraint, [remaining[first], remaining[second]]), constraint.target)) return true;
    }
  }
  return false;
}

/** Returns up to limit complete solutions without reading level.solution. */
export function findSolutions(level, { limit = 2, board = null } = {}) {
  if (!(limit > 0)) return [];
  const working = level.digits.map((_, index) => board && !isEmpty(board[index]) ? board[index] : null);
  if (board && board.length > level.digits.length && board.slice(level.digits.length).some(value => !isEmpty(value))) return [];
  if (!evaluateBoard(level, working).valid) return [];
  const available = level.digits.filter(value => !working.includes(value));
  const related = level.digits.map((_, index) => level.constraints.filter(constraint => constraint.cells.includes(index)));
  const solutions = [];
  function search(remaining) {
    if (solutions.length >= limit) return;
    if (!level.constraints.every(constraint => constraintPossible(constraint, working, remaining))) return;
    if (!remaining.length) { solutions.push(working.slice()); return; }
    let bestCell = -1;
    let bestCandidates = null;
    for (let cell = 0; cell < working.length; cell += 1) {
      if (!isEmpty(working[cell])) continue;
      const candidates = [];
      for (const value of remaining) {
        working[cell] = value;
        const next = remaining.filter(candidate => candidate !== value);
        if (related[cell].every(constraint => constraintPossible(constraint, working, next))) candidates.push(value);
      }
      working[cell] = null;
      if (!candidates.length) return;
      if (!bestCandidates || candidates.length < bestCandidates.length || (candidates.length === bestCandidates.length && related[cell].length > related[bestCell].length)) {
        bestCell = cell;
        bestCandidates = candidates;
      }
      if (candidates.length === 1) break;
    }
    for (const value of bestCandidates) {
      working[bestCell] = value;
      search(remaining.filter(candidate => candidate !== value));
      working[bestCell] = null;
      if (solutions.length >= limit) break;
    }
  }
  search(available);
  return solutions;
}

/** Reasoning prompts deliberately explain a next step instead of revealing a cell. */
export function getHint(level, board) {
  const state = evaluateBoard(level, board);
  if (state.invalidCells.length) return { kind: 'conflict', title: '先检查数字卡', text: '每张数字卡只能用一次。检查高亮格子是否重复使用数字，或使用了本关没有的数字。', cells: state.invalidCells };
  const failed = state.constraints.find(constraint => constraint.status === 'violated');
  if (failed) {
    const clue = level.constraints.find(constraint => constraint.id === failed.id);
    return { kind: 'conflict', title: '有一条线索还没成立', text: `${clue.label}。这组格子的当前结果是 ${Number(failed.value.toFixed(3))}，请重新检查与它相交的线索。`, cells: clue.cells.slice() };
  }
  if (state.solved) return { kind: 'complete', title: '全部线索成立', text: '所有数字卡都已使用，所有线索都成立。你完成了这关！', cells: [] };
  const remaining = level.digits.filter(value => !board.includes(value));
  const impossible = level.constraints.find(constraint => !constraintPossible(constraint, board, remaining));
  if (impossible) return { kind: 'conflict', title: '这组数字需要重新考虑', text: `${impossible.label}。按目前的填法，剩余数字卡已经无法满足这条线索。先调整高亮格子中的数字，再继续推导。`, cells: impossible.cells.slice() };
  const near = level.constraints.find(constraint => constraint.cells.filter(cell => isEmpty(board[cell])).length === 1);
  if (near) {
    const text = near.kind === 'sum' ? `这组格子的和是 ${near.target}。先加起已填数字，再用目标和减去这个和，就能确定最后一格。`
      : near.kind === 'product' ? `这组格子的积是 ${near.target}。先乘起已填数字，再用目标积除以这个积，并检查剩余数字卡。`
      : near.kind === 'difference' ? `两个格子的差是 ${near.target}。对已填数字分别加、减这个差，再用剩余数字卡和交叉线索排除。`
      : `两个格子的大数是小数的 ${near.target} 倍。分别尝试乘、除这个倍数，再检查剩余数字卡。`;
    return { kind: 'deduction', title: '从只差一格的线索入手', text, cells: near.cells.slice() };
  }
  const strategies = level.hints || [];
  const selected = strategies.find(hint => hint.cells.some(cell => isEmpty(board[cell]))) || strategies[0];
  if (selected) return { kind: 'strategy', ...selected, cells: selected.cells.slice() };
  const clue = level.constraints.find(constraint => constraint.kind === 'product') || level.constraints[0];
  return { kind: 'strategy', title: '寻找限制最多的格子', text: '先找同时出现在几条线索里的格子，列出可能数字；再利用数字卡不能重复的规则排除。', cells: clue ? clue.cells.slice() : [] };
}
