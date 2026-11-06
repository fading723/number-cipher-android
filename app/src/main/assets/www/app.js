import { LEVELS } from './levels.js';
import { evaluateBoard, getHint } from './engine.js';

const STORAGE_KEY = 'shuzhen.progress.v1';
const app = document.getElementById('app');
const dialogRoot = document.getElementById('dialog-root');
const tierNames = { tutorial: '推理入门', normal: '数阵推演', challenge: '深度挑战' };
const kindNames = { sum: '和', product: '积', difference: '差', ratio: '倍数' };
const paths = {
  back: '<path d="m14 6-6 6 6 6"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 8.5a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 1.8-2.4 3.6M12 16.7v.1"/>',
  undo: '<path d="M8 5 3 10l5 5M4 10h10a6 6 0 0 1 0 12" transform="translate(0 -2)"/>',
  erase: '<path d="m14 3 7 7-10 10H6l-4-4L14 3Zm-7 8 7 7M11 20h10"/>',
  pencil: '<path d="m15 4 5 5M4 20l5-1L21 7l-5-5L4 14v6Z"/>',
  reset: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  bulb: '<path d="M9 18h6M10 21h4M8 14c-6-6-1-12 4-12s10 6 4 12c-1 1-1 2-1 2H9s0-1-1-2Z"/>',
  book: '<path d="M12 5C8 2 3 3 3 3v16s5-1 9 2c4-3 9-2 9-2V3s-5-1-9 2Zm0 0v16"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17h7m-3.5-3.5v7"/>',
  leaf: '<path d="M20 3C8 2 2 8 5 15s14 5 15-12ZM6 18l9-9M3 21l3-3"/>',
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.grid}</svg>`;
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
const pad = number => String(number).padStart(2, '0');
let storageWarning = '';
let save = readSave();
let view = { screen: 'home', tier: save.tier || 'normal', level: null, selected: 0, notes: false, highlight: null, hint: null, conflicts: [], modal: null };
let toastTimer;
let drag = null;
let touchTap = null;
let ignoreClickUntil = 0;
let ignoreClickSource = null;
let ignoreClickKey = '';
let modalFocus = null;

function cleanSnapshot(raw, level) {
  if (!raw || !Array.isArray(raw.board) || raw.board.length !== level.digits.length) return null;
  const board = raw.board.map(value => level.digits.includes(value) ? value : null);
  const seen = new Set();
  for (let index = 0; index < board.length; index++) {
    if (board[index] === null) continue;
    if (seen.has(board[index])) board[index] = null;
    else seen.add(board[index]);
  }
  const notes = board.map((value, index) => value === null && Array.isArray(raw.notes?.[index])
    ? [...new Set(raw.notes[index].filter(number => level.digits.includes(number)))].sort((a,b) => a-b) : []);
  return { board, notes, moves: Math.max(0, Number.isFinite(raw.moves) ? Math.floor(raw.moves) : 0) };
}

function readSave() {
  const fresh = { version: 1, lastLevel: 1, tier: 'normal', progress: {} };
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!raw || raw.version !== 1 || !raw.progress || typeof raw.progress !== 'object') return fresh;
    if (LEVELS.some(level => level.id === raw.lastLevel)) fresh.lastLevel = raw.lastLevel;
    if (tierNames[raw.tier]) fresh.tier = raw.tier;
    for (const level of LEVELS) {
      const item = raw.progress[level.id];
      const snapshot = cleanSnapshot(item, level);
      if (!snapshot) continue;
      fresh.progress[level.id] = { ...snapshot, hints: Math.max(0, Number.isFinite(item.hints) ? Math.floor(item.hints) : 0),
        completed: item.completed === true, bestMoves: Number.isFinite(item.bestMoves) ? item.bestMoves : null,
        history: Array.isArray(item.history) ? item.history.slice(-80).map(entry => cleanSnapshot(entry, level)).filter(Boolean) : [] };
    }
    return fresh;
  } catch {
    storageWarning = '暂时无法读取进度，可以继续游戏。';
    return fresh;
  }
}

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(save)); }
  catch {
    storageWarning = '当前无法保存进度，请保持应用打开。';
    toast(storageWarning);
  }
}

function entryFor(level) {
  return save.progress[level.id] ||= {
    board: Array(level.digits.length).fill(null), notes: level.digits.map(() => []),
    moves: 0, hints: 0, history: [], completed: false, bestMoves: null,
  };
}

function currentEntry() { return entryFor(view.level); }
function cellName(index, level = view.level) { return `${String.fromCharCode(65 + Math.floor(index / level.size))}${index % level.size + 1}`; }
function toast(text) {
  const element = document.getElementById('toast');
  element.textContent = text;
  element.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('visible'), 3000);
}

function clearToast() {
  clearTimeout(toastTimer);
  document.getElementById('toast').classList.remove('visible');
}

function renderHome() {
  const complete = LEVELS.filter(level => save.progress[level.id]?.completed).length;
  let resume = LEVELS.find(level => level.id === save.lastLevel) || LEVELS[0];
  if (save.progress[resume.id]?.completed && evaluateBoard(resume, entryFor(resume).board).solved) {
    resume = LEVELS.find(level => !save.progress[level.id]?.completed) || resume;
  }
  const started = save.progress[resume.id]?.board.some(value => value !== null);
  app.innerHTML = `<main class="app-shell home-screen">
    <header class="topbar"><div class="brand"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><div><div class="brand-name">数阵破译</div><div class="tiny-label">THE NUMBER ATELIER</div></div></div><button class="icon-button" data-action="help" aria-label="玩法手册">${icon('book')}</button></header>
    ${storageWarning ? `<div class="local-warning" role="status">${escape(storageWarning)}</div>` : ''}
    <section class="hero"><div class="hero-eyebrow">观察 · 推导 · 豁然开朗</div><h1>每一个数字，<br>都有它的位置。</h1><p>从一条线索出发，<br>用数学思维，解开整个数阵。</p><div class="hero-footer"><span>你的破译旅程</span><span class="hero-number">${pad(complete)} <small>/ ${LEVELS.length}</small></span></div><div class="progress-track" role="progressbar" aria-label="已通关" aria-valuemin="0" aria-valuemax="${LEVELS.length}" aria-valuenow="${complete}"><i style="width:${100 * complete / LEVELS.length}%"></i></div></section>
    <div class="section-heading"><h2>${started ? '接着想一想' : '开始一次推演'}</h2><span>不限时，慢慢想</span></div>
    <button class="continue-card" data-action="open-level" data-level="${resume.id}"><span class="continue-icon">${icon('grid')}</span><span class="continue-body"><span class="eyebrow">${tierNames[resume.tier]} · 第 ${pad(resume.id)} 关</span><strong>${escape(resume.title)}</strong></span><span class="continue-arrow">${icon('arrow')}</span></button>
    <div class="section-heading"><h2>关卡地图</h2><span>30 道题 · 30 次发现</span></div>
    <div class="tabs" role="tablist" aria-label="选择难度">${Object.entries(tierNames).map(([tier, name]) => `<button class="tab ${view.tier === tier ? 'active' : ''}" role="tab" aria-selected="${view.tier === tier}" data-action="filter" data-tier="${tier}">${name} <span>${LEVELS.filter(level => level.tier === tier).length}</span></button>`).join('')}</div>
    <div class="level-grid" role="tabpanel" aria-label="${tierNames[view.tier]}关卡">${LEVELS.filter(level => level.tier === view.tier).map(level => {
      const item = save.progress[level.id];
      const progress = item?.board.some(value => value !== null);
      return `<button class="level-card ${item?.completed ? 'complete' : ''}" data-action="open-level" data-level="${level.id}" aria-label="第${level.id}关 ${escape(level.title)}${item?.completed ? ' 已完成' : ''}"><span class="level-number">${pad(level.id)}</span>${item?.completed ? '<span class="level-check" aria-hidden="true">✓</span>' : progress ? '<span class="level-dot" aria-label="进行中"></span>' : ''}<span class="level-title">${escape(level.title)}</span><span class="level-meta">${item?.completed ? '已破译' : progress ? '推演中' : `${level.size} × ${level.digits.length / level.size} 数阵`}</span></button>`;
    }).join('')}</div>
    <p class="section-caption">${view.tier === 'tutorial' ? '从小数阵开始，认识和、积、差与候选标记。' : view.tier === 'normal' ? '让横纵线索相遇，在因数与数的关系中找到突破口。' : '线索更少，关联更深。试着比较不同区域，找出隐藏的关系。'}</p>
    <footer class="home-foot">${icon('leaf')} 进度自动保存 · 随时回来继续</footer>
  </main>`;
}

function openLevel(id) {
  const level = LEVELS.find(item => item.id === id);
  if (!level) return;
  clearToast();
  const item = entryFor(level);
  view = { ...view, screen: 'game', level, selected: Math.max(0, item.board.findIndex(value => value === null)), notes: false, highlight: null, hint: null, conflicts: [], modal: null };
  save.lastLevel = id;
  persist();
  renderGame();
  window.scrollTo(0, 0);
}

function sameCells(actual, expected) {
  return actual.length === expected.length && expected.every(cell => actual.includes(cell));
}

function renderGame() {
  const level = view.level;
  const item = currentEntry();
  const result = evaluateBoard(level, item.board);
  const statuses = new Map(result.constraints.map(constraint => [constraint.id, constraint]));
  const columns = level.size;
  const rows = level.digits.length / columns;
  const rowClues = Array.from({ length: rows }, (_, row) => level.constraints.find(constraint => ['sum','product'].includes(constraint.kind) && sameCells(constraint.cells, Array.from({length:columns}, (_,col) => row * columns + col))));
  const colClues = Array.from({ length: columns }, (_, col) => level.constraints.find(constraint => ['sum','product'].includes(constraint.kind) && sameCells(constraint.cells, Array.from({length:rows}, (_,row) => row * columns + col))));
  const edges = new Set([...rowClues, ...colClues].filter(Boolean).map(constraint => constraint.id));
  const extraClues = level.constraints.filter(constraint => !edges.has(constraint.id));
  const highlightCells = view.highlight ? level.constraints.find(constraint => constraint.id === view.highlight)?.cells || [] : view.hint?.cells || [];
  const clue = constraint => constraint ? `<button class="edge-clue ${statuses.get(constraint.id).status} ${view.highlight === constraint.id ? 'active' : ''}" data-action="clue" data-clue="${escape(constraint.id)}" aria-label="${escape(constraint.label)}，${statuses.get(constraint.id).status === 'satisfied' ? '已满足' : statuses.get(constraint.id).status === 'violated' ? '有冲突' : '待推理'}"><small>${kindNames[constraint.kind]}</small><strong>${constraint.target}</strong></button>` : '<span class="edge-clue empty"></span>';
  let boardMarkup = `<span></span>${Array.from({length:columns}, (_,col) => `<span class="axis-label">${col+1}</span>`).join('')}<span></span>`;
  for (let row = 0; row < rows; row++) {
    boardMarkup += `<span class="axis-label">${String.fromCharCode(65+row)}</span>`;
    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      const value = item.board[index];
      const notes = item.notes[index];
      boardMarkup += `<button class="cell ${view.selected === index ? 'selected' : ''} ${highlightCells.includes(index) ? 'highlighted' : ''} ${view.conflicts.includes(index) ? 'conflict' : ''}" data-cell="${index}" aria-label="${cellName(index)}格，${value !== null ? value : notes.length ? `候选数字${notes.join('、')}` : '空白'}" aria-pressed="${view.selected === index}" ${value !== null ? `data-drag-number="${value}"` : ''}>${value !== null ? `<span class="cell-value">${value}</span>` : notes.length ? `<span class="cell-note">${Array.from({length:9}, (_,i) => `<span>${notes.includes(i+1) ? i+1 : ''}</span>`).join('')}</span>` : '<span class="empty-dot" aria-hidden="true"></span>'}</button>`;
    }
    boardMarkup += clue(rowClues[row]);
  }
  boardMarkup += `<span></span>${colClues.map(clue).join('')}<span></span>`;
  const selectedClue = level.constraints.find(constraint => constraint.id === view.highlight);
  const satisfied = result.constraints.filter(constraint => constraint.status === 'satisfied').length;
  const oldScroll = window.scrollY;
  const focusCell = document.activeElement?.dataset.cell;
  const focusNumber = document.activeElement?.dataset.number;
  app.innerHTML = `<main class="app-shell game-screen">
    <header class="game-topbar"><button class="icon-button" data-action="back" aria-label="返回关卡地图">${icon('back')}</button><div class="game-topbar-center"><small>THE NUMBER ATELIER</small><strong>第 ${pad(level.id)} / ${LEVELS.length} 关</strong></div><button class="icon-button" data-action="help" aria-label="玩法手册">${icon('help')}</button></header>
    <div class="game-intro"><h1>${escape(level.title)}</h1><span class="tier-badge ${level.tier}">${tierNames[level.tier]}</span></div>
    <p class="game-instruction">把 ${level.digits[0]}—${level.digits[level.digits.length - 1]} 填入数阵，每个数字恰好使用一次。</p>
    <section class="board-panel" aria-label="数学数阵"><div class="board-header"><span>寻找数字之间的联系</span><span class="counter"><i class="counter-dot"></i>${satisfied} / ${level.constraints.length} 条线索</span></div>
    <div class="puzzle-layout" style="--columns:${columns}" role="group" aria-label="${rows}行${columns}列棋盘">${boardMarkup}</div>
    ${extraClues.length ? `<div class="extra-clues" aria-label="附加条件">${extraClues.map(constraint => `<button class="clue-pill ${statuses.get(constraint.id).status} ${view.highlight === constraint.id ? 'active' : ''}" data-action="clue" data-clue="${escape(constraint.id)}"><span>${escape(constraint.label)}</span><span class="clue-state" aria-label="${statuses.get(constraint.id).status === 'satisfied' ? '已满足' : statuses.get(constraint.id).status === 'violated' ? '有冲突' : '待推理'}">${statuses.get(constraint.id).status === 'satisfied' ? '✓' : statuses.get(constraint.id).status === 'violated' ? '!' : '↗'}</span></button>`).join('')}</div>` : ''}
    <div class="board-legend"><span class="legend-dot"></span>轻点线索，查看它关联的格子</div>
    ${selectedClue ? `<div class="clue-detail" role="status"><strong>${escape(selectedClue.label)}</strong><br>关联 ${selectedClue.cells.map(index => cellName(index)).join('、')}${selectedClue.kind === 'difference' ? '；差指较大数减较小数。' : selectedClue.kind === 'ratio' ? '；倍数指较大数除以较小数。' : ''}</div>` : ''}</section>
    <div class="tools-row" aria-label="推理工具"><button class="tool-button" data-action="undo" ${!item.history.length ? 'disabled' : ''}>${icon('undo')}撤销</button><button class="tool-button" data-action="erase">${icon('erase')}擦除</button><button class="tool-button ${view.notes ? 'active' : ''}" data-action="notes" aria-pressed="${view.notes}">${icon('pencil')}候选标记</button><button class="tool-button" data-action="reset">${icon('reset')}重来</button></div>
    <div class="bank-header"><strong>${view.notes ? '记录可能的数字' : '数字卡片'}</strong><span>${view.notes ? '标记不会参与运算' : `${item.board.filter(value => value !== null).length} / ${level.digits.length} 已放置`}</span></div>
    <div class="number-bank ${view.notes ? 'notes-mode' : ''}" style="--bank-columns:${level.digits.length <= 4 ? 4 : level.digits.length <= 6 ? 3 : 5}" role="group" aria-label="数字卡片">${level.digits.map(number => `<button class="number-key ${item.board.includes(number) ? 'used' : ''} ${view.notes && item.notes[view.selected].includes(number) ? 'note-selected' : ''}" data-number="${number}" data-drag-number="${number}" aria-label="${view.notes ? '标记候选' : '填入数字'}${number}${item.board.includes(number) ? '，已在棋盘上' : ''}">${number}</button>`).join('')}</div>
    <p class="bank-foot">${view.notes ? '选择空格，再点数字；再点一次取消标记' : result.solved ? '所有线索都成立，你解开了这个数阵' : `已选 ${cellName(view.selected)} · 点数字填入，也可以拖放`}</p>
    <div class="actions-row"><button class="secondary-button" data-action="hint">${icon('bulb')}给点思路</button><button class="primary-button" data-action="check">${icon('check')}${result.solved ? '查看通关' : '检查推理'}</button></div>
    ${view.hint ? `<aside class="hint-panel" role="status"><strong>${icon('bulb')}${escape(view.hint.title)}</strong><p>${escape(view.hint.text)}</p><button class="hint-dismiss" data-action="dismiss-hint">收起思路</button></aside>` : ''}
    <p class="game-bottom-note">${item.moves} 次操作 · 没有倒计时，留一点时间给思考</p>
  </main>`;
  if (focusCell !== undefined) app.querySelector(`[data-cell="${focusCell}"]`)?.focus({preventScroll:true});
  else if (focusNumber !== undefined) app.querySelector(`[data-number="${focusNumber}"]`)?.focus({preventScroll:true});
  window.scrollTo(0, oldScroll);
}

function snapshot() {
  const item = currentEntry();
  item.history.push({ board: [...item.board], notes: item.notes.map(notes => [...notes]), moves: item.moves });
  if (item.history.length > 80) item.history.shift();
}

function boardChanged({ countMove = true } = {}) {
  const item = currentEntry();
  if (countMove) item.moves++;
  view.hint = null;
  view.conflicts = [];
  const solved = evaluateBoard(view.level, item.board).solved;
  if (solved) {
    item.completed = true;
    item.bestMoves = item.bestMoves === null ? item.moves : Math.min(item.moves, item.bestMoves);
  }
  persist();
  renderGame();
  if (solved) showSuccess();
}

function putNumber(number, target = view.selected) {
  if (view.screen !== 'game' || !view.level.digits.includes(number)) return;
  const item = currentEntry();
  view.selected = target;
  if (view.notes) {
    if (item.board[target] !== null) return toast('先选择一个空格，再记录候选数字。');
    snapshot();
    const notes = item.notes[target];
    item.notes[target] = notes.includes(number) ? notes.filter(value => value !== number) : [...notes,number].sort((a,b) => a-b);
    boardChanged({ countMove: false });
    return;
  }
  if (item.board[target] === number) { renderGame(); return; }
  snapshot();
  const previous = item.board.indexOf(number);
  if (previous !== -1) {
    item.board[previous] = item.board[target];
    item.notes[previous] = [];
  }
  item.board[target] = number;
  item.notes[target] = [];
  item.notes = item.notes.map(notes => notes.filter(value => value !== number));
  boardChanged();
}

function eraseCell() {
  const item = currentEntry();
  if (item.board[view.selected] === null && !item.notes[view.selected].length) return toast('这个格子已经是空的。');
  snapshot();
  item.board[view.selected] = null;
  item.notes[view.selected] = [];
  boardChanged();
}

function undo() {
  const item = currentEntry();
  const last = item.history.pop();
  if (!last) return;
  Object.assign(item, last);
  view.hint = null;
  view.conflicts = [];
  persist();
  renderGame();
}

function giveHint() {
  const item = currentEntry();
  const hint = getHint(view.level, item.board);
  // A conflict or deduction always takes priority; only cycle general strategies.
  if (view.hint && hint.kind === 'strategy' && view.level.hints?.length) {
    view.hint = view.level.hints[item.hints % view.level.hints.length];
  } else view.hint = hint;
  item.hints++;
  view.highlight = null;
  persist();
  renderGame();
  app.querySelector('.hint-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function checkBoard() {
  const result = evaluateBoard(view.level, currentEntry().board);
  if (result.solved) return showSuccess();
  view.conflicts = [...new Set([...result.invalidCells, ...result.constraints.filter(constraint => constraint.status === 'violated').reduce((cells, constraint) => cells.concat(view.level.constraints.find(item => item.id === constraint.id).cells), [])])];
  renderGame();
  if (view.conflicts.length) toast('标出的区域还不满足线索，试着重新安排数字。');
  else toast('已填满的线索没有冲突；继续推导剩余位置。');
}

function returnHome() {
  clearToast();
  persist();
  view.screen = 'home';
  view.hint = null;
  renderHome();
  window.scrollTo(0,0);
}

function showModal(content, type, extraClass = '') {
  modalFocus = document.activeElement;
  view.modal = type;
  app.inert = true;
  app.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'hidden';
  dialogRoot.innerHTML = `<div class="modal-backdrop"><section class="modal ${extraClass}" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">${content}</section></div>`;
  dialogRoot.querySelector('.modal').focus();
}

function closeModal() {
  view.modal = null;
  dialogRoot.innerHTML = '';
  app.inert = false;
  app.removeAttribute('aria-hidden');
  document.body.style.overflow = '';
  if (modalFocus?.isConnected) modalFocus.focus({preventScroll:true});
}

function showHelp() {
  showModal(`<div class="tiny-label" style="margin-bottom:8px">A LITTLE GUIDE</div><h2 id="modal-title">从一条线索开始</h2><p>把给定数字全部填入棋盘，每个数字只用一次，让所有条件同时成立。</p>
    <div class="guide-line"><span class="guide-index">01</span><div><strong>点击填数，也能拖放</strong><p>先点格子，再点数字卡。把已放置的数字移到另一个有数字的格子，会交换两个数字。</p></div></div>
    <div class="guide-line"><span class="guide-index">02</span><div><strong>横纵线索，一起看</strong><p>棋盘右侧对应一整行，下方对应一整列。其他条件会写在棋盘下；点任意线索即可高亮关联格子。A、B、C 表示行，1、2、3 表示列。</p></div></div>
    <div class="guide-line"><span class="guide-index">03</span><div><strong>和、积、差与倍数</strong><p>和是相加，积是相乘；差按较大数减较小数，倍数按较大数除以较小数。数字不能重复。</p></div></div>
    <div class="guide-formula">1 × 5 × 7 = 35</div><p>例如三格的积为 35，可先寻找它的因数，再结合行的和决定顺序。</p>
    <div class="guide-line"><span class="guide-index">04</span><div><strong>给思考留点空间</strong><p>候选标记用来记录可能性，不参与运算。可随时撤销；提示会给推理方向。绿色线索表示局部条件成立，全部满足才算通关。</p></div></div>
    <div class="modal-actions"><button class="primary-button" data-action="close-modal">开始推理</button></div>`, 'help');
}

function confirmReset() {
  showModal(`<h2 id="modal-title">重新推演这一关？</h2><p>将清空本关数字、候选标记和撤销记录。已经获得的通关记录会保留。</p><div class="modal-actions"><button class="secondary-button" data-action="close-modal">继续思考</button><button class="primary-button" data-action="confirm-reset">重新开始</button></div>`, 'reset');
}

function resetLevel() {
  const item = currentEntry();
  Object.assign(item, { board: Array(view.level.digits.length).fill(null), notes: view.level.digits.map(() => []), history: [], moves: 0, hints: 0 });
  closeModal();
  view.selected = 0;
  view.notes = false;
  view.hint = null;
  view.highlight = null;
  view.conflicts = [];
  persist();
  renderGame();
  toast('数阵已清空，换一个角度再想想。');
}

function showSuccess() {
  const item = currentEntry();
  const level = view.level;
  const next = LEVELS.find(candidate => candidate.id > level.id);
  showModal(`<div class="success-mark">${icon('check')}</div><div class="success-eyebrow">每一次推导，都算数</div><h2 id="modal-title">数阵，已破译。</h2><p>${escape(level.title)}<br>每个数字各就其位，所有线索都成立。</p><div class="success-stats"><div><strong>${level.constraints.length}</strong><small>条线索闭合</small></div><div><strong>${item.moves}</strong><small>次填数操作</small></div><div><strong>${item.hints}</strong><small>次思路提示</small></div></div><div class="modal-actions"><button class="secondary-button" data-action="finish-home">关卡地图</button><button class="primary-button" data-action="${next ? 'next-level' : 'close-modal'}" ${next ? `data-level="${next.id}"` : ''}>${next ? '下一关' : '欣赏数阵'} ${icon('arrow')}</button></div>`, 'success', 'success-modal');
}

function activateButton(target) {
  if (!target || target.disabled) return;
  if (target.dataset.cell !== undefined && view.screen === 'game') {
    view.selected = Number(target.dataset.cell);
    renderGame();
    return;
  }
  if (target.dataset.number !== undefined && view.screen === 'game') {
    putNumber(Number(target.dataset.number));
    return;
  }
  switch (target.dataset.action) {
    case 'open-level': openLevel(Number(target.dataset.level)); break;
    case 'filter': view.tier = target.dataset.tier; save.tier = view.tier; persist(); renderHome(); break;
    case 'back': returnHome(); break;
    case 'help': showHelp(); break;
    case 'close-modal': closeModal(); break;
    case 'undo': undo(); break;
    case 'erase': eraseCell(); break;
    case 'notes': view.notes = !view.notes; renderGame(); break;
    case 'reset': confirmReset(); break;
    case 'confirm-reset': resetLevel(); break;
    case 'hint': giveHint(); break;
    case 'dismiss-hint': view.hint = null; renderGame(); break;
    case 'check': checkBoard(); break;
    case 'clue': view.highlight = view.highlight === target.dataset.clue ? null : target.dataset.clue; view.hint = null; renderGame(); break;
    case 'finish-home': closeModal(); returnHome(); break;
    case 'next-level': closeModal(); openLevel(Number(target.dataset.level)); break;
  }
}

function buttonKey(button) {
  if (!button) return '';
  return ['action','cell','number','level','tier','clue'].map(name => `${name}:${button.dataset[name] || ''}`).join('|');
}

document.addEventListener('click', event => {
  const target = event.target.closest('button');
  if (event.detail !== 0 && Date.now() < ignoreClickUntil
      && (event.sourceCapabilities?.firesTouchEvents || target === ignoreClickSource || buttonKey(target) === ignoreClickKey)) return;
  activateButton(target);
});

document.addEventListener('keydown', event => {
  if (view.modal) {
    if (event.key === 'Escape') { event.preventDefault(); closeModal(); }
    if (event.key === 'Tab') {
      const items = [...dialogRoot.querySelectorAll('button:not([disabled])')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement.classList.contains('modal'))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    return;
  }
  if (view.screen !== 'game' || event.altKey || event.metaKey) return;
  if ((event.ctrlKey && event.key.toLowerCase() === 'z') || event.key.toLowerCase() === 'u') { event.preventDefault(); undo(); return; }
  if (event.ctrlKey) return;
  if (/^[1-9]$/.test(event.key)) { event.preventDefault(); putNumber(Number(event.key)); }
  else if (event.key === 'Backspace' || event.key === 'Delete') { event.preventDefault(); eraseCell(); }
  else if (event.key.toLowerCase() === 'n') { event.preventDefault(); view.notes = !view.notes; renderGame(); }
  else if (event.key === 'Escape') returnHome();
  else if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) {
    event.preventDefault();
    const offset = { ArrowLeft:-1, ArrowRight:1, ArrowUp:-view.level.size, ArrowDown:view.level.size }[event.key];
    view.selected = (view.selected + offset + view.level.digits.length) % view.level.digits.length;
    renderGame();
    app.querySelector(`[data-cell="${view.selected}"]`)?.focus({preventScroll:true});
  }
});

document.addEventListener('pointerdown', event => {
  const button = event.target.closest('button');
  if (event.pointerType === 'touch' && button && !button.disabled) {
    touchTap = { source: button, pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
  }
  if (view.screen !== 'game' || view.modal || view.notes || event.button !== 0) return;
  const source = event.target.closest('[data-drag-number]');
  if (!source) return;
  drag = { number: Number(source.dataset.dragNumber), x: event.clientX, y: event.clientY, pointerId: event.pointerId, source, moving: false, ghost: null };
  source.setPointerCapture?.(event.pointerId);
});

document.addEventListener('pointermove', event => {
  if (touchTap && event.pointerId === touchTap.pointerId && Math.hypot(event.clientX-touchTap.x, event.clientY-touchTap.y) >= 8) touchTap.moved = true;
  if (!drag || event.pointerId !== drag.pointerId) return;
  if (!drag.moving && Math.hypot(event.clientX-drag.x, event.clientY-drag.y) < 8) return;
  if (!drag.moving) {
    drag.moving = true;
    drag.ghost = document.createElement('div');
    drag.ghost.className = 'drag-ghost';
    drag.ghost.textContent = drag.number;
    document.body.append(drag.ghost);
  }
  drag.ghost.style.left = `${event.clientX}px`;
  drag.ghost.style.top = `${event.clientY}px`;
  app.querySelector('.drag-over')?.classList.remove('drag-over');
  document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-cell]')?.classList.add('drag-over');
});

function finishDrag(event, cancelled = false) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const current = drag;
  drag = null;
  current.ghost?.remove();
  current.source.releasePointerCapture?.(event.pointerId);
  app.querySelector('.drag-over')?.classList.remove('drag-over');
  if (current.moving) {
    ignoreClickUntil = Date.now()+350;
    ignoreClickSource = current.source;
    ignoreClickKey = buttonKey(current.source);
    if (!cancelled) {
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-cell]');
      if (target) {
        const targetIndex = Number(target.dataset.cell);
        const levelId = view.level.id;
        // Keep the captured touch source connected until touchend/click finish.
        // Replacing it inside pointerup can suppress the following tap in WebView.
        setTimeout(() => {
          if (view.screen === 'game' && view.level.id === levelId && !view.modal) putNumber(current.number, targetIndex);
        }, 0);
      }
    }
  }
}
function finishTouchTap(event, cancelled) {
  if (!touchTap || event.pointerId !== touchTap.pointerId) return;
  const tap = touchTap;
  touchTap = null;
  if (cancelled || tap.moved || !tap.source.isConnected) return;
  const hit = document.elementFromPoint(event.clientX, event.clientY)?.closest('button');
  if (hit !== tap.source || (view.modal && !tap.source.closest('#dialog-root'))) return;
  // Touch activation is explicit: some WebViews suppress a compatibility click
  // immediately after a captured drag. Mouse and accessibility clicks still work.
  ignoreClickSource = tap.source;
  ignoreClickKey = buttonKey(tap.source);
  ignoreClickUntil = Date.now() + 700;
  event.preventDefault();
  activateButton(tap.source);
}
document.addEventListener('pointerup', event => {
  finishDrag(event);
  finishTouchTap(event, false);
});
document.addEventListener('pointercancel', event => {
  finishDrag(event, true);
  finishTouchTap(event, true);
});

// The Android host asks this before finishing its Activity.
window.onAndroidBack = () => {
  if (view.modal) { closeModal(); return true; }
  if (view.screen === 'game') { returnHome(); return true; }
  return false;
};
window.addEventListener('pagehide', persist);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') persist(); });
renderHome();
