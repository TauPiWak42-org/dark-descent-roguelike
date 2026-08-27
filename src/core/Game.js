import { EventSystem } from './EventSystem.js';
import { GameLoop } from './GameLoop.js';

/**
 * Главный класс игры
 * Управляет состоянием игры и координирует все системы
 * @class Game
 */
export class Game {
  constructor() {
    this.events = new EventSystem();
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.state = 'loading'; // loading, menu, playing, paused, gameover
    this.debugMode = false;
    
    this.width = 0;
    this.height = 0;
    
    this.setupCanvas();
    this.setupGameLoop();
    this.setupEventListeners();
  }

  /**
   * Настройка canvas
   * @private
   */
  setupCanvas() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  /**
   * Изменение размера canvas
   */
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    this.events.emit('game:resize', { width: this.width, height: this.height });
  }

  /**
   * Настройка игрового цикла
   * @private
   */
  setupGameLoop() {
    this.gameLoop = new GameLoop(
      (deltaTime) => this.update(deltaTime),
      () => this.render()
    );
  }

  /**
   * Настройка слушателей событий
   * @private
   */
  setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F3') {
        this.debugMode = !this.debugMode;
        console.log(`Debug mode: ${this.debugMode ? 'ON' : 'OFF'}`);
      }
      
      if (e.key === 'Escape') {
        this.togglePause();
      }
    });
  }

  /**
   * Запуск игры
   */
  start() {
    this.state = 'playing';
    this.gameLoop.start();
    this.events.emit('game:start');
    console.log('Game started');
  }

  /**
   * Обновление логики игры
   * @param {number} deltaTime - Время с прошлого кадра в секундах
   */
  update(deltaTime) {
    if (this.state !== 'playing') return;
    
    this.events.emit('game:update', deltaTime);
  }

  /**
   * Отрисовка игры
   */
  render() {
    // Очистка canvas
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Отрисовка систем
    this.events.emit('game:render', this.ctx);
    
    // Отладочная информация
    if (this.debugMode) {
      this.renderDebugInfo();
    }
  }

  /**
   * Отображение отладочной информации
   * @private
   */
  renderDebugInfo() {
    const ctx = this.ctx;
    const lineHeight = 20;
    const startX = 10;
    let startY = this.height - 100;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(startX - 5, startY - 15, 200, 100);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    
    ctx.fillText(`FPS: ${this.gameLoop.getFps()}`, startX, startY);
    ctx.fillText(`State: ${this.state}`, startX, startY + lineHeight);
    ctx.fillText(`Frame: ${this.gameLoop.frameCount}`, startX, startY + lineHeight * 2);
    
    // Золотая рамка
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.strokeRect(startX - 5, startY - 15, 200, 100);
  }

  /**
   * Переключение паузы
   */
  togglePause() {
    if (this.state === 'playing') {
      this.state = 'paused';
      this.gameLoop.pause();
      this.events.emit('game:pause');
    } else if (this.state === 'paused') {
      this.state = 'playing';
      this.gameLoop.resume();
      this.events.emit('game:resume');
    }
  }

  /**
   * Завершение игры
   */
  gameOver() {
    this.state = 'gameover';
    this.events.emit('game:over');
  }

  /**
   * Перезапуск игры
   */
  restart() {
    this.state = 'playing';
    this.events.emit('game:restart');
  }
}
