'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  // Setup
  const Game = window.Game;

  const scoreEl = document.querySelector('.game-score');
  const btn = document.querySelector('.button');
  const msgStart = document.querySelector('.message-start');
  const msgWin = document.querySelector('.message-win');
  const msgLose = document.querySelector('.message-lose');
  const fieldTable = document.querySelector('.game-field');
  const rowEls = fieldTable ? fieldTable.querySelectorAll('.field-row') : [];
  const HIDDEN = 'hidden';

  const game = new Game();

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
      if (s === 'idle') {
        btn.textContent = 'Start';
        btn.classList.add('start');
        btn.classList.remove('restart');
      } else {
        btn.textContent = 'Restart';
        btn.classList.remove('start');
        btn.classList.add('restart');
      }
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
      } else {
        game.restart();
      }
      renderAll();
    });
  }

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    const prevStatus = game.getStatus();
    let moved = false;

    switch (e.key) {
      case 'ArrowLeft':
        moved = game.moveLeft();
        e.preventDefault();
        break;
      case 'ArrowRight':
        moved = game.moveRight();
        e.preventDefault();
        break;
      case 'ArrowUp':
        moved = game.moveUp();
        e.preventDefault();
        break;
      case 'ArrowDown':
        moved = game.moveDown();
        e.preventDefault();
        break;
      default:
        return;
    }

    const nextStatus = game.getStatus();

    if (moved || nextStatus !== prevStatus) {
      renderAll();
    }
  });

  // Init
  renderAll();
});
