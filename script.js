(() => {
  const CALM_FACES = ['🙂', '😌', '😎', '🤓', '😏', '🧐', '🥸', '😴', '🙃', '😇'];
  const ANGRY_FACE = '😡';

  const grid = document.getElementById('grid');
  const sizeSelect = document.getElementById('sizeSelect');
  const newGameBtn = document.getElementById('newGameBtn');
  const playAgainBtn = document.getElementById('playAgainBtn');
  const scoreValue = document.getElementById('scoreValue');
  const bestValue = document.getElementById('bestValue');
  const overlay = document.getElementById('overlay');
  const overlayEmoji = document.getElementById('overlayEmoji');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayText = document.getElementById('overlayText');

  const BEST_KEY = 'angryUncle.bestBySize';

  let angryIndex = -1;
  let revealedCount = 0;
  let safeTotal = 0;
  let gameOver = false;
  let currentSize = parseInt(sizeSelect.value, 10);

  function loadBestMap() {
    try {
      return JSON.parse(localStorage.getItem(BEST_KEY)) || {};
    } catch {
      return {};
    }
  }

  function getBest(size) {
    return loadBestMap()[size] || 0;
  }

  function setBest(size, value) {
    const map = loadBestMap();
    if (value > (map[size] || 0)) {
      map[size] = value;
      localStorage.setItem(BEST_KEY, JSON.stringify(map));
    }
    return map[size] || value;
  }

  function randomCalmFace() {
    return CALM_FACES[Math.floor(Math.random() * CALM_FACES.length)];
  }

  function columnsFor(size) {
    return Math.round(Math.sqrt(size));
  }

  function newGame(size) {
    currentSize = size;
    angryIndex = Math.floor(Math.random() * size);
    revealedCount = 0;
    safeTotal = size - 1;
    gameOver = false;

    grid.style.gridTemplateColumns = `repeat(${columnsFor(size)}, 1fr)`;
    grid.innerHTML = '';

    for (let i = 0; i < size; i++) {
      const box = document.createElement('button');
      box.className = 'box';
      box.type = 'button';
      box.setAttribute('aria-label', 'Hidden box');
      const face = document.createElement('span');
      face.className = 'face';
      face.textContent = i === angryIndex ? ANGRY_FACE : randomCalmFace();
      box.appendChild(face);
      box.addEventListener('click', () => handleTap(box, i));
      grid.appendChild(box);
    }

    scoreValue.textContent = '0';
    bestValue.textContent = String(getBest(size));
    overlay.classList.add('hidden');
  }

  function handleTap(box, index) {
    if (gameOver || box.classList.contains('revealed')) return;

    if (index === angryIndex) {
      box.classList.add('revealed', 'angry');
      endGame(false);
    } else {
      box.classList.add('revealed', 'safe');
      revealedCount++;
      scoreValue.textContent = String(revealedCount);
      if (revealedCount >= safeTotal) {
        endGame(true);
      }
    }
  }

  function revealAll() {
    [...grid.children].forEach((box, i) => {
      if (box.classList.contains('revealed')) return;
      box.classList.add('revealed', i === angryIndex ? 'angry' : 'safe');
    });
  }

  function endGame(won) {
    gameOver = true;
    revealAll();
    const best = setBest(currentSize, revealedCount);
    bestValue.textContent = String(best);

    if (won) {
      overlayEmoji.textContent = '🎉';
      overlayTitle.textContent = 'You cleared the grid!';
      overlayText.textContent = `You safely tapped all ${safeTotal} boxes and dodged the angry uncle.`;
    } else {
      overlayEmoji.textContent = ANGRY_FACE;
      overlayTitle.textContent = 'You woke him up!';
      overlayText.textContent = `You survived ${revealedCount} safe tap${revealedCount === 1 ? '' : 's'} this round.`;
      if (navigator.vibrate) navigator.vibrate(200);
    }

    setTimeout(() => overlay.classList.remove('hidden'), 350);
  }

  newGameBtn.addEventListener('click', () => newGame(parseInt(sizeSelect.value, 10)));
  playAgainBtn.addEventListener('click', () => newGame(currentSize));
  sizeSelect.addEventListener('change', () => newGame(parseInt(sizeSelect.value, 10)));

  newGame(currentSize);
})();
