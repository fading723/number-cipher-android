import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { findSolutions, constraintValue } from '../app/src/main/assets/www/engine.js';
import { analyzeDifficulty } from './analyze-difficulty.mjs';

let seed = 20261106;
function random() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }
function shuffle(values) {
  const result = values.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}
const symbol = { sum: '和', product: '积', difference: '差', ratio: '倍数' };
const normalTitles = ['交叉相遇', '因数的秘密', '横竖之间', '换个角度', '奇偶线索', '环环相扣', '乘法密码', '角落里的提示', '两条路', '交点突破', '数字的边界', '大小之间', '排除之后', '藏在中间', '重新排列', '连锁推理', '逆向思考', '数阵之钥'];
const challengeTitles = ['斜线谜团', '四角围合', '中心枢纽', '稀疏线索', '分组与配对', '无声的对称', '交错回路', '条件之网', '最后的数阵'];
function clue(solution, kind, cells, name, id) {
  const target = constraintValue({ kind }, cells.map(cell => solution[cell]));
  return { id, kind, cells: cells.slice(), target, label: kind === 'ratio' ? `${name}：大数 ÷ 小数 = ${target}` : `${name}的${symbol[kind]} = ${target}` };
}
function makeHints(constraints) {
  const hints = [];
  const product = constraints.find(constraint => constraint.kind === 'product');
  const pair = constraints.find(constraint => constraint.kind === 'difference' || constraint.kind === 'ratio');
  const cross = constraints.find(constraint => constraint.id.startsWith('cross'));
  if (product) hints.push({ title: '从因数开始', text: `${product.label}。这些格子里的每个数字都必须是目标积的因数；先排除不可能的数字卡，再观察它们与其他线索的交点。`, cells: product.cells });
  if (pair) hints.push({ title: pair.kind === 'ratio' ? '把数字配成对' : '用差值缩小范围', text: `${pair.label}。先在数字卡中找出满足条件的数字对，再借助两个位置各自的其他线索确定顺序。`, cells: pair.cells });
  if (cross) hints.push({ title: '同时看两组格子', text: `${cross.label}。找出它与另一条线索共同的格子；共同部分能帮助你比较两组剩下的数字。`, cells: cross.cells });
  const sum = constraints.find(constraint => constraint.kind === 'sum');
  if (sum) hints.push({ title: '估算范围，再排除', text: `${sum.label}。比较剩余最小、最大数字能组成的和，排除明显过大或过小的搭配；注意数字卡不能重复。`, cells: sum.cells });
  return hints;
}
function buildLevel(id, tier, digits, solution, constraints, title, size = 3) {
  return { id, title, tier, size, digits: digits.slice(), solution: solution.slice(), constraints, hints: makeHints(constraints) };
}
function unique(level) { return findSolutions(level, { limit: 2 }).length === 1; }

const levels = [];
{
  const solution = [1, 3, 4, 2];
  const constraints = [clue(solution, 'sum', [0, 1], '第1行', 'row-0'), clue(solution, 'sum', [0, 2], '第1列', 'col-0'), clue(solution, 'difference', [0, 3], '主对角两格', 'cross-diagonal'), clue(solution, 'product', [1, 3], '第2列', 'col-1')];
  levels.push(buildLevel(1, 'tutorial', [1, 2, 3, 4], solution, constraints, '一张卡，一个位置', 2));
}
{
  const solution = [2, 5, 3, 6, 1, 4];
  const constraints = [clue(solution, 'sum', [0, 1, 2], '第1行', 'row-0'), clue(solution, 'product', [0, 3], '第1列', 'col-0'), clue(solution, 'sum', [1, 4], '第2列', 'col-1'), clue(solution, 'sum', [2, 5], '第3列', 'col-2'), clue(solution, 'difference', [0, 1], '上排左侧两格', 'cross-pair'), clue(solution, 'product', [0, 2], '上排两端', 'cross-end-product')];
  levels.push(buildLevel(2, 'tutorial', [1, 2, 3, 4, 5, 6], solution, constraints, '交叉检查'));
}
{
  const solution = [4, 1, 6, 2, 5, 3];
  const constraints = [clue(solution, 'product', [0, 1, 2], '第1行', 'row-0'), clue(solution, 'sum', [3, 4, 5], '第2行', 'row-1'), clue(solution, 'ratio', [0, 3], '第1列', 'col-0'), clue(solution, 'sum', [1, 4], '第2列', 'col-1'), clue(solution, 'difference', [2, 5], '第3列', 'col-2'), clue(solution, 'sum', [0, 4], '斜向两格', 'cross-diagonal')];
  levels.push(buildLevel(3, 'tutorial', [1, 2, 3, 4, 5, 6], solution, constraints, '差与倍数'));
}
const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
const columns = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
const regions = [
  [[0, 4, 8], '主对角线'], [[2, 4, 6], '副对角线'], [[0, 2, 6, 8], '四个角'],
  [[1, 3, 5, 7], '四个边心'], [[0, 1, 3, 4], '左上四格'], [[1, 2, 4, 5], '右上四格'],
  [[3, 4, 6, 7], '左下四格'], [[4, 5, 7, 8], '右下四格'], [[1, 4, 7], '中间竖线'],
  [[0, 4, 7], 'A1、B2、C2'], [[2, 3, 7], 'A3、B1、C2'], [[1, 5, 6], 'A2、B3、C1'],
  [[0, 5, 7], 'A1、B3、C2'], [[2, 4, 7], 'A3、B2、C2'], [[1, 3, 8], 'A2、B1、C3'],
];
function extraPool(solution) {
  const extra = [];
  regions.forEach(([cells, name], index) => {
    extra.push(clue(solution, 'sum', cells, name, `cross-sum-${index}`));
    if (cells.length === 3) extra.push(clue(solution, 'product', cells, name, `cross-product-${index}`));
  });
  for (let a = 0; a < 9; a += 1) for (let b = a + 1; b < 9; b += 1) {
    const name = `${String.fromCharCode(65 + Math.floor(a / 3))}${a % 3 + 1} 与 ${String.fromCharCode(65 + Math.floor(b / 3))}${b % 3 + 1}`;
    extra.push(clue(solution, 'difference', [a, b], name, `cross-difference-${a}-${b}`));
    if (Math.max(solution[a], solution[b]) % Math.min(solution[a], solution[b]) === 0) extra.push(clue(solution, 'ratio', [a, b], name, `cross-ratio-${a}-${b}`));
  }
  return extra;
}
{
  const solution = [2, 8, 5, 9, 3, 1, 4, 6, 7];
  const constraints = rows.map((cells, index) => clue(solution, 'sum', cells, `第${index + 1}行`, `row-${index}`)).concat(columns.map((cells, index) => clue(solution, 'product', cells, `第${index + 1}列`, `col-${index}`)), clue(solution, 'sum', [0, 4, 8], '主对角线', 'cross-diagonal'));
  levels.push(buildLevel(4, 'normal', digits, solution, constraints, normalTitles[0]));
}
for (let id = 5; id <= 21; id += 1) {
  const solution = shuffle(digits);
  const mode = (id - 5) % 6;
  const constraints = [];
  rows.forEach((cells, index) => constraints.push(clue(solution, mode === 0 || (mode === 2 && index % 2 === 0) ? 'product' : 'sum', cells, `第${index + 1}行`, `row-${index}`)));
  columns.forEach((cells, index) => constraints.push(clue(solution, mode === 0 || mode === 3 || (mode === 2 && index % 2 === 0) ? 'sum' : 'product', cells, `第${index + 1}列`, `col-${index}`)));
  if (mode === 4) constraints.pop();
  const extra = shuffle(extraPool(solution));
  if (mode === 3 || mode === 5) constraints.push(extra.find(constraint => constraint.kind === (mode === 3 ? 'difference' : 'ratio')));
  const level = buildLevel(id, 'normal', digits, solution, constraints, normalTitles[id - 4]);
  for (const candidate of extra) {
    if (unique(level)) break;
    if (!constraints.some(constraint => constraint.id === candidate.id)) constraints.push(candidate);
  }
  level.hints = makeHints(constraints);
  levels.push(level);
}
for (let id = 22; id <= 30; id += 1) {
  const solution = shuffle(digits);
  const mode = id - 22;
  const pool = shuffle(extraPool(solution));
  // Sparse clues overlap different regions. Few complete rows/columns are given.
  const constraints = [clue(solution, mode % 2 ? 'sum' : 'product', rows[mode % 3], `第${mode % 3 + 1}行`, `row-${mode % 3}`)];
  const firstRegion = regions[mode % regions.length];
  constraints.push(clue(solution, 'sum', firstRegion[0], firstRegion[1], `cross-anchor-${mode}`));
  const level = buildLevel(id, 'challenge', digits, solution, constraints, challengeTitles[mode]);
  const pairKind = mode % 2 ? 'ratio' : 'difference';
  constraints.push(pool.find(candidate => candidate.kind === pairKind));
  for (const candidate of pool) {
    if (unique(level)) break;
    if (!constraints.some(constraint => constraint.id === candidate.id)) constraints.push(candidate);
  }
  // Remove clues only when their absence preserves a unique solution. Keep a
  // complete-row anchor and one cross-region anchor for a useful starting point.
  for (let index = constraints.length - 1; index >= 2; index -= 1) {
    const removed = constraints.splice(index, 1)[0];
    if (!unique(level)) constraints.splice(index, 0, removed);
  }
  level.hints = makeHints(constraints);
  levels.push(level);
}
// Repair only the three challenge boards that local candidate propagation
// previously solved outright. Run this after generating all boards so the
// original seed stream and every other level remain unchanged.
const baseline = analyzeDifficulty(levels[3]);
for (const id of [25, 26, 28]) {
  const original = levels[id - 1];
  const solution = original.solution;
  const mode = id - 22;
  let replacement = null;
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const pool = shuffle(extraPool(solution));
    const region = regions[mode % regions.length];
    const constraints = [
      clue(solution, mode % 2 ? 'sum' : 'product', rows[mode % 3], `第${mode % 3 + 1}行`, `row-${mode % 3}`),
      clue(solution, 'sum', region[0], region[1], `cross-anchor-${mode}`),
      pool.find(candidate => candidate.kind === (mode % 2 ? 'ratio' : 'difference')),
    ];
    const candidateLevel = buildLevel(id, 'challenge', digits, solution, constraints, original.title);
    for (const candidate of pool) {
      if (unique(candidateLevel)) break;
      if (!constraints.some(constraint => constraint.id === candidate.id)) constraints.push(candidate);
    }
    for (let index = constraints.length - 1; index >= 2; index -= 1) {
      const removed = constraints.splice(index, 1)[0];
      if (!unique(candidateLevel)) constraints.splice(index, 0, removed);
    }
    const difficulty = analyzeDifficulty(candidateLevel);
    if (constraints.length <= 6 && difficulty.forcedCells === 0 && difficulty.remainingCandidates >= 30
      && difficulty.firstSolutionDepth > baseline.firstSolutionDepth && difficulty.solutions === 1) {
      candidateLevel.hints = makeHints(constraints);
      replacement = candidateLevel;
      break;
    }
  }
  if (!replacement) throw new Error(`Could not produce a deeper challenge for level ${id}`);
  levels[id - 1] = replacement;
}
for (const level of levels) {
  const solutions = findSolutions(level, { limit: 2 });
  if (solutions.length !== 1 || solutions[0].some((value, index) => value !== level.solution[index])) throw new Error(`Level ${level.id} is not uniquely solvable`);
}
const destination = new URL('../app/src/main/assets/www/levels.js', import.meta.url);
await mkdir(new URL('../app/src/main/assets/www/', import.meta.url), { recursive: true });
await writeFile(destination, `// Generated deterministically by scripts/generate-levels.mjs.\n// All 30 boards are exhaustively checked for a unique solution.\nexport const LEVELS = ${JSON.stringify(levels, null, 2)};\n`, 'utf8');
console.log(`Generated ${levels.length} uniquely solvable levels: ${fileURLToPath(destination)}`);
console.log(levels.map(level => `${String(level.id).padStart(2)} ${level.tier.padEnd(9)} ${level.constraints.length} clues (${[...new Set(level.constraints.map(constraint => constraint.kind))].join(', ')})`).join('\n'));
