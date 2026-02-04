// Configuration
const CFG = {
  username: 'admin',
  password: 'admin',
  maxRuns: 3,
  attemptsPerLayer: 3,
  patterns: [
    { question: '2, 4, 8, 16, ?', answer: '32' },
    { question: '1, 1, 2, 3, 5, 8, ?', answer: '13' },
    { question: '3, 6, 9, 12, ?', answer: '15' },
    { question: '1, 4, 9, 16, ?', answer: '25' }
  ],
  sequences: [
    ['red', 'blue', 'green', 'yellow'],
    ['green', 'yellow', 'red', 'blue'],
    ['blue', 'red', 'yellow', 'green']
  ]
};

// UI Text Constants
const TITLES = [
  '',
  'Layer 1: Login Credentials',
  'Layer 2: Pattern Recognition',
  'Layer 3: Memory Grid Challenge',
  'Layer 4: Sequence Recall'
];

const HINTS = [
  '',
  'Username: admin<br>Password: admin',
  'Find the pattern',
  'Remember the positions',
  'Memorize the color order'
];

// Application State
let S = {
  layer: 1,
  attempts: { 1: 3, 2: 3, 3: 3, 4: 3 },
  currentRun: 1,
  locked: 0,
  permanentLock: 0,
  currentPattern: null,
  gridCorrect: [],
  gridClicked: [],
  sequence: [],
  userSequence: []
};

// DOM Element References
const E = {
  attempts: document.getElementById('attempts'),
  levelText: document.getElementById('currentLevel'),
  log: document.getElementById('log'),
  username: document.getElementById('user'),
  password: document.getElementById('pass'),
  pattern: document.getElementById('pattern'),
  patternInput: document.getElementById('patternInput'),
  grid: document.getElementById('grid'),
  seqDisplay: document.getElementById('sequenceDisplay'),
  colorButtons: document.getElementById('colorButtons'),
  tray: document.getElementById('tray'),
  mainBtn: document.getElementById('mainBtn'),
  hint: document.getElementById('hint'),
  hintBox: document.getElementById('hintBox'),
  denied: document.getElementById('denied'),
  permLock: document.getElementById('permanentLockout'),
  resetsLeft: document.getElementById('resetsLeft'),
  success: document.getElementById('success'),
  messageBox: document.getElementById('messageBox')
};

// Utility Functions
function showMessage(text, type) {
  E.messageBox.textContent = text;
  E.messageBox.className = `message-box ${type} show`;
  setTimeout(() => {
    E.messageBox.classList.remove('show');
  }, 3000);
}

function showLayer(layer) {
  ['layer1', 'layer2', 'layer3', 'layer4', 'success', 'denied', 'permanentLockout'].forEach(id => 
    document.getElementById(id)?.classList.add('hidden')
  );
  
  if (layer > 0 && layer <= 4) {
    document.getElementById('layer' + layer)?.classList.remove('hidden');
    S.layer = layer;
    E.levelText.textContent = TITLES[layer];
    E.hint.innerHTML = HINTS[layer];
    E.hintBox.classList[layer === 1 ? 'add' : 'remove']('highlighted');
  }
  updateUI();
}

function updateUI() {
  E.attempts.textContent = `Attempts remaining: ${S.attempts[S.layer]} (Run ${S.currentRun}/${CFG.maxRuns})`;
  
  ['p1', 'p2', 'p3', 'p4'].forEach((id, index) => {
    const badge = document.getElementById(id);
    const layerNum = index + 1;
    badge.className = 'level-item';
    if (layerNum < S.layer) badge.classList.add('done');
    else if (layerNum === S.layer) badge.classList.add('active');
  });
  
  if (E.resetsLeft) E.resetsLeft.textContent = CFG.maxRuns - S.currentRun;
  E.mainBtn.textContent = S.layer === 1 ? 'Submit' : S.layer === 2 ? 'Verify Pattern' : 'Continue';
}

function addLog(message) {
  const li = document.createElement('li');
  li.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  E.log.appendChild(li);
  E.log.parentElement.scrollTop = E.log.parentElement.scrollHeight;
}

function handleFailure() {
  S.attempts[S.layer]--;
  addLog(`[FAILED] Layer ${S.layer} authentication failed`);
  updateUI();
  E.attempts.classList.add('flash-attention');
  setTimeout(() => E.attempts.classList.remove('flash-attention'), 800);
  
  if (S.attempts[S.layer] === 0) {
    addLog(`[LOCKED] All attempts for run ${S.currentRun} exhausted`);
    showLayer(0);
    E.denied.classList.remove('hidden');
    
    if (S.currentRun < CFG.maxRuns) {
      E.mainBtn.classList.remove('hidden');
      E.mainBtn.textContent = `Start New Run (${CFG.maxRuns - S.currentRun} left)`;
      E.mainBtn.onclick = startNewRun;
    } else {
      E.mainBtn.classList.add('hidden');
      setTimeout(() => {
        E.denied.classList.add('hidden');
        E.permLock.classList.remove('hidden');
        S.permanentLock = 1;
        addLog('[LOCKOUT] Permanent lockout - all runs exhausted');
      }, 1500);
    }
  }
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Layer 1: Login
function handleLogin() {
  if (S.permanentLock) return;
  
  if (E.username.value.trim() === CFG.username && E.password.value === CFG.password) {
    showMessage('Well done! Login successful!', 'success');
    addLog('[SUCCESS] Layer 1: Login credentials verified');
    setTimeout(() => {
      showLayer(2);
      initPattern();
    }, 1200);
  } else {
    showMessage('Invalid username or password!', 'error');
    handleFailure();
    E.password.value = '';
  }
}

// Layer 2: Pattern Recognition
function initPattern() {
  S.currentPattern = random(CFG.patterns);
  E.pattern.textContent = S.currentPattern.question;
  E.patternInput.value = '';
  E.patternInput.focus();
}

function verifyPattern() {
  if (S.permanentLock) return;
  
  if (E.patternInput.value.trim() === S.currentPattern.answer) {
    showMessage('Well done! Pattern correct!', 'success');
    addLog('[SUCCESS] Layer 2: Pattern recognition passed');
    setTimeout(() => {
      showLayer(3);
      initGrid();
      E.mainBtn.classList.add('hidden');
    }, 1200);
  } else {
    showMessage('Incorrect pattern answer!', 'error');
    handleFailure();
    E.patternInput.value = '';
  }
}

// Layer 3: Memory Grid
function initGrid() {
  E.grid.innerHTML = '';
  S.gridCorrect = [];
  S.gridClicked = [];
  S.locked = 1;
  E.mainBtn.classList.add('hidden');
  
  while (S.gridCorrect.length < 3) {
    const pos = Math.floor(Math.random() * 10);
    if (!S.gridCorrect.includes(pos)) S.gridCorrect.push(pos);
  }
  
  for (let i = 0; i < 10; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.onclick = () => handleGridClick(i, cell);
    E.grid.appendChild(cell);
  }
  
  S.gridCorrect.forEach(i => E.grid.children[i].classList.add('flash'));
  setTimeout(() => {
    S.gridCorrect.forEach(i => E.grid.children[i].classList.remove('flash'));
    S.locked = 0;
  }, 1500);
}

function handleGridClick(index, cell) {
  if (S.locked || cell.classList.contains('clicked')) return;
  
  cell.classList.add('clicked');
  if (!S.gridCorrect.includes(index)) {
    cell.classList.add('wrong');
    showMessage('Wrong cell selected!', 'error');
    handleFailure();
    if (S.attempts[S.layer] > 0) {
      setTimeout(() => initGrid(), 1200);
    }
    return;
  }
  
  S.gridClicked.push(index);
  if (S.gridClicked.length === 3) {
    showMessage('Well done! Memory challenge passed!', 'success');
    addLog('[SUCCESS] Layer 3: Memory challenge completed');
    setTimeout(() => {
      showLayer(4);
      initSequence();
      E.mainBtn.classList.add('hidden');
    }, 1200);
  }
}

// Layer 4: Sequence Recall
function initSequence() {
  E.tray.innerHTML = '';
  S.userSequence = [];
  S.locked = 1;
  E.colorButtons.classList.add('hidden');
  S.sequence = random(CFG.sequences);
  
  let i = 0;
  const interval = setInterval(() => {
    E.seqDisplay.innerHTML = `<div class="color-btn ${S.sequence[i]}"></div>`;
    i++;
    if (i === S.sequence.length) {
      clearInterval(interval);
      setTimeout(() => {
        E.seqDisplay.innerHTML = '';
        S.locked = 0;
        E.colorButtons.classList.remove('hidden');
      }, 800);
    }
  }, 800);
}

function pickColor(color) {
  if (S.locked) return;
  
  const disc = document.createElement('div');
  disc.className = 'color-btn ' + color;
  E.tray.appendChild(disc);
  S.userSequence.push(color);
  
  if (S.userSequence.length === S.sequence.length) {
    S.locked = 1;
    setTimeout(() => {
      if (S.userSequence.every((val, idx) => val === S.sequence[idx])) {
        showMessage('Well done! Sequence correct!', 'success');
        addLog('[SUCCESS] Layer 4: Sequence verification passed');
        addLog('[COMPLETE] All security layers authenticated');
        setTimeout(() => {
          showLayer(0);
          E.success.classList.remove('hidden');
          E.mainBtn.textContent = 'Start Over';
          E.mainBtn.classList.remove('hidden');
          E.mainBtn.onclick = resetSystem;
        }, 1200);
      } else {
        showMessage('Wrong sequence order!', 'error');
        handleFailure();
        if (S.attempts[S.layer] > 0) {
          setTimeout(() => initSequence(), 1200);
        }
      }
    }, 300);
  }
}

// System Management
function startNewRun() {
  if (S.permanentLock) return;
  
  S.currentRun++;
  addLog(`[NEW RUN] Starting run ${S.currentRun}/${CFG.maxRuns}`);
  S.layer = 1;
  S.attempts = { 1: 3, 2: 3, 3: 3, 4: 3 };
  S.locked = 0;
  E.username.value = '';
  E.password.value = '';
  E.patternInput.value = '';
  E.mainBtn.classList.remove('hidden');
  E.mainBtn.onclick = handleMainButton;
  showLayer(1);
}

function resetSystem() {
  S.layer = 1;
  S.attempts = { 1: 3, 2: 3, 3: 3, 4: 3 };
  S.currentRun = 1;
  S.locked = 0;
  S.permanentLock = 0;
  E.username.value = '';
  E.password.value = '';
  E.patternInput.value = '';
  E.mainBtn.classList.remove('hidden');
  E.mainBtn.onclick = handleMainButton;
  addLog('[RESET] System fully reset');
  showLayer(1);
}

function handleMainButton() {
  if (S.layer === 1) handleLogin();
  else if (S.layer === 2) verifyPattern();
}

// Event Listeners & Initialization
E.mainBtn.onclick = handleMainButton;
E.password.addEventListener('keypress', e => {
  if (e.key === 'Enter') handleMainButton();
});
E.patternInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') handleMainButton();
});

// Initialize the application
showLayer(1);
addLog('[INIT] VIT Security System initialized');
