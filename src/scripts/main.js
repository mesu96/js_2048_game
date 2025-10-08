'use strict';

// Import ESM
import Game from '../modules/Game.class.js';

document.addEventListener('DOMContentLoaded', () => {
  // Setup
  const scoreEl = document.querySelector('.game-score');
  const btn = document.querySelector('.button');
  const msgStart = document.querySelector('.message-start');
  const msgWin = document.querySelector('.message-win');
  const msgLose = document.querySelector('.message-lose');
  const fieldTable = document.querySelector('.game-field');
  const rowEls = fieldTable ? fieldTable.querySelectorAll('.field-row') : [];
  const HIDDEN = 'hidden';

  const game = new Game();
  let hasFirstMove = false;

  // Render
  function clearValueClasses(el) {
    for (const cls of [...el.classList]) {
      if (cls.startsWith('field-cell--')) {
        el.classList.remove(cls);
      }
    }
  }

  function renderBoard() {
    if (!rowEls || rowEls.length !== 4) {
      return;
    }

    const state = game.getState();

    for (let r = 0; r < 4; r++) {
      const cells = rowEls[r].querySelectorAll('.field-cell');

      for (let c = 0; c < 4; c++) {
        const td = cells[c];
        const v = state[r][c];

        clearValueClasses(td);
        td.textContent = v ? String(v) : '';

        if (v) {
          td.classList.add(`field-cell--${v}`);
        }
      }
    }
  }

  function renderScore() {
    if (scoreEl) {
      scoreEl.textContent = String(game.getScore());
    }
  }

  function renderMessagesAndButton() {
    const s = game.getStatus();

    if (msgStart) {
      msgStart.classList.toggle(HIDDEN, s !== 'idle');
    }

    if (msgWin) {
      msgWin.classList.toggle(HIDDEN, s !== 'win');
    }

    if (msgLose) {
      msgLose.classList.toggle(HIDDEN, s !== 'lose');
    }

    if (btn) {
      const label =
        s === 'idle' || (s === 'playing' && !hasFirstMove)
          ? 'Start'
          : 'Restart';

      btn.textContent = label;
      btn.classList.toggle('start', label === 'Start');
      btn.classList.toggle('restart', label === 'Restart');
    }
  }

  function renderAll() {
    renderBoard();
    renderScore();
    renderMessagesAndButton();
  }

  // Handlers
  if (btn) {
    btn.addEventListener('click', () => {
      const s = game.getStatus();

      if (s === 'idle') {
        game.start();
        hasFirstMove = false;
        renderAll();

        return;
      }

      if (s === 'playing' && !hasFirstMove) {
        renderAll();

        return;
      }

      game.restart();
      hasFirstMove = false;
      renderAll();
    });
  }

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    const key = e.key;
    // Akceptujemy obie formy: 'ArrowRight' i 'Right' itd.
    const isLeft = key === 'ArrowLeft' || key === 'Left';
    const isRight = key === 'ArrowRight' || key === 'Right';
    const isUp = key === 'ArrowUp' || key === 'Up';
    const isDown = key === 'ArrowDown' || key === 'Down';

    // jeśli to nie strzałka — ignoruj
    if (!isLeft && !isRight && !isUp && !isDown) {
      return;
    }

    const prevStatus = game.getStatus();
    let moved = false;

    if (isLeft) {
      moved = game.moveLeft();
      e.preventDefault();
    }

    if (isRight) {
      moved = game.moveRight();
      e.preventDefault();
    }

    if (isUp) {
      moved = game.moveUp();
      e.preventDefault();
    }

    if (isDown) {
      moved = game.moveDown();
      e.preventDefault();
    }

    const nextStatus = game.getStatus();

    if (moved) {
      hasFirstMove = true;
    }

    if (moved || nextStatus !== prevStatus) {
      renderAll();
    }
  });

  // Init
  renderAll();
});
