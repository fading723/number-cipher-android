// A transparent baseline reasoning model, independent of the gameplay solver.
// It repeatedly applies local clue supports, used-card elimination and a card's
// only possible position. It does not model every strategy a student may use.
import { pathToFileURL } from 'node:url';

function resultOf(clue, values) {
  if (clue.kind === 'sum') return values.reduce((sum, value) => sum + value, 0);
  if (clue.kind === 'product') return values.reduce((product, value) => product * value, 1);
  if (clue.kind === 'difference') return Math.abs(values[0] - values[1]);
  return Math.max(...values) / Math.min(...values);
}

export function propagateDomains(level, input = level.digits.map(() => level.digits)) {
  const domains = input.map(values => new Set(values));
  let rounds = 0;
  let changed = true;
  while (changed) {
    changed = false;
    rounds += 1;
    const singles = domains.filter(domain => domain.size === 1).map(domain => [...domain][0]);
    if (new Set(singles).size !== singles.length || domains.some(domain => !domain.size)) return { domains, contradiction: true, rounds };
    for (const domain of domains) {
      if (domain.size > 1) for (const value of singles) if (domain.delete(value)) changed = true;
    }
    for (const digit of level.digits) {
      const positions = domains.map((domain, index) => domain.has(digit) ? index : -1).filter(index => index >= 0);
      if (!positions.length) return { domains, contradiction: true, rounds };
      if (positions.length === 1 && domains[positions[0]].size > 1) {
        domains[positions[0]] = new Set([digit]);
        changed = true;
      }
    }
    for (const clue of level.constraints) {
      const support = clue.cells.map(() => new Set());
      const values = [];
      function visit(index) {
        if (index === clue.cells.length) {
          if (Math.abs(resultOf(clue, values) - clue.target) < 1e-9) values.forEach((value, position) => support[position].add(value));
          return;
        }
        for (const value of domains[clue.cells[index]]) {
          if (values.includes(value)) continue;
          values.push(value);
          visit(index + 1);
          values.pop();
        }
      }
      visit(0);
      clue.cells.forEach((cell, index) => {
        for (const value of domains[cell]) if (!support[index].has(value)) { domains[cell].delete(value); changed = true; }
      });
    }
  }
  return { domains, contradiction: domains.some(domain => !domain.size), rounds };
}

export function analyzeDifficulty(level) {
  const initial = propagateDomains(level);
  let branches = 0;
  let branchAttempts = 0;
  let firstSolutionDepth = null;
  let maxDepth = 0;
  let solutions = 0;
  function search(state, depth) {
    if (state.contradiction || solutions > 1) return;
    maxDepth = Math.max(maxDepth, depth);
    let selected = -1;
    for (let index = 0; index < state.domains.length; index += 1) {
      if (state.domains[index].size > 1 && (selected < 0 || state.domains[index].size < state.domains[selected].size)) selected = index;
    }
    if (selected < 0) { solutions += 1; if (firstSolutionDepth === null) firstSolutionDepth = depth; return; }
    branches += 1;
    for (const value of [...state.domains[selected]].sort((a, b) => a - b)) {
      branchAttempts += 1;
      const next = state.domains.map(domain => [...domain]);
      next[selected] = [value];
      search(propagateDomains(level, next), depth + 1);
    }
  }
  search(initial, 0);
  return {
    id: level.id, tier: level.tier, clues: level.constraints.length,
    forcedCells: initial.domains.filter(domain => domain.size === 1).length,
    remainingCandidates: initial.domains.reduce((total, domain) => total + domain.size, 0),
    initialRounds: initial.rounds, branches, branchAttempts, firstSolutionDepth, maxDepth, solutions,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { LEVELS } = await import('../app/src/main/assets/www/levels.js');
  console.log('Baseline: repeated clue-local candidate filtering + used-card elimination + only-position rule.');
  console.log('These are reasoning-model metrics, not a claim about student-perceived difficulty.');
  console.table(LEVELS.map(analyzeDifficulty));
}
