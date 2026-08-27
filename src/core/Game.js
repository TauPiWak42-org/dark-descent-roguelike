import { EventSystem } from './EventSystem.js';
import { GameLoop } from './GameLoop.js';

/**
 * \u000413\u00043b\u000430\u000432\u00043d\u00044b\u000439 \u00043a\u00043b\u000430\u000441\u000441 \u000438\u000433\u000440\u00044b
 * \u000423\u00043f\u000440\u000430\u000432\u00043b\u00044f\u000435\u000442 \u000441\u00043e\u000441\u000442\u00043e\u00044f\u00043d\u000438\u000435\u00043c \u000438\u000433\u000440\u00044b \u000438 \u00043a\u00043e\u00043e\u000440\u000434\u000438\u00043d\u000438\u000440\u000443\u000435\u000442 \u000441\u000438\u000441\u000442\u000435\u00043c\u00044b 32\u000441\u000435 \u000441\u000438\u000441\u000442\u000435\u00043c\u000430\u00043c\u000438
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
   * \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 canvas
   * @private
   */
  setupCanvas() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  /**
   * \u000418\u000437\u00043c\u000435\u00043d\u000435\u00043d\u000438\u000435 \u000440\u000430\u000437\u00043c\u000435\u000440\u000430 canvas
   */
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    this.events.emit('game:resize', { width: this.width, height: this.height });
  }

  /**
   * \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u000438\u000433\u000440\u00043e\u000432\u00043e\u000433\u00043e \u000446\u000438\u00043a\u00043b
   * @private
   */
  setupGameLoop() {
    this.gameLoop = new GameLoop(
      (deltaTime) => this.update(deltaTime),
      () => this.render()
    );
  }

  /**
   * \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u000441\u00043b\u000443\u000448\u000430\u000442\u000435\u00043b\u000435\u000439 \u000441\u00043e\u000431\u00044b\u000442\u000438\u000439
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
   * \u000417\u000430\u00043f\u000443\u000441\u00043a \u000438\u000433\u000440\u00044b
   */
  start() {
    this.state = 'playing';
    this.gameLoop.start();
    this.events.emit('game:start');
    console.log('Game started');
  }

  /**
   * \u00041e\u000431\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u00043b\u00043e\u000433\u000438\u00043a\u000430 \u000438\u000433\u000440\u00044b
   * @param {number} deltaTime - \u000412\u000440\u000435\u00043c\u00044f \u000441 \u00043f\u000440\u00043e\u000448\u00043b\u00043e\u000433\u00043e \u00043a\u000430\u000434\u000440\u000430 \u000432 \u000441\u000435\u00043a\u000443\u00043d\u000434\u000430\u000445
   */
  update(deltaTime) {
    if (this.state !== 'playing') return;
    
    this.events.emit('game:update', deltaTime);
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000430 \u000438\u000433\u000440\u00044b
   */
  render() {
    // \u000413\u000435\u00043d\u000435\u000440\u000430\u000446\u000438\u00044f \u000446\u000443\u00043c\u000430\u000442 Perlin \u000434\u00043b\u00044f \u000444\u00043e\u00043d\u000430
    this.renderCaveBackground();
    
    // \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000430 \u000441\u000438\u000441\u000442\u000435\u00043c
    this.events.emit('game:render', this.ctx);
    
    // \u00041e\u000442\u00043e\u000431\u000440\u000430\u000436\u000435\u00043d\u000438\u000435 \u00043e\u000442\u00043b\u000430\u000434\u00043e\u000447\u00043d\u000430\u00044f \u000438\u00043d\u000444\u00043e\u000440\u00043c\u000430\u000446\u000438\u00044f
    if (this.debugMode) {
      this.renderDebugInfo();
    }
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u000444\u00043e\u00043d\u000430\u000432 \u00043f\u000435\u000449\u000435\u000440\u00044b
   * \u000418\u000441\u00043f\u00043e\u00043b\u00044c\u000437\u00043e\u000432\u000430\u00043d\u000438\u000435 Perlin \u000448\u000443\u00043c \u000434\u00043b\u00044f \u000442\u000435\u00043a\u000441\u000442\u000443\u000440\u00044b
   * @private
   */
  renderCaveBackground() {
    const ctx = this.ctx;
    const tileSize = 64;
    
    // \u000414\u00043e\u000431\u000430\u000432\u00043b\u000435\u00043d\u000438\u000435 \u000442\u000435\u00043a\u000441\u000442\u000443\u000440\u00044b
    for (let y = 0; y < this.height + tileSize; y += tileSize) {
      for (let x = 0; x < this.width + tileSize; x += tileSize) {
        const noiseX = x * 0.02;
        const noiseY = y * 0.02;
        const noiseValue = Math.sin(noiseX) * Math.cos(noiseY) * 0.5 + 0.5;
        
        // \u00041f\u000440\u000435\u000432\u000440\u000430\u000448\u000441\u000430 \u000432 \u000446\u000432\u000435\u000442
        let color;
        if (noiseValue < 0.3) {
          color = '#1a1a2e';
        } else if (noiseValue < 0.45) {
          color = '#2d1b00';
        } else if (noiseValue < 0.6) {
          color = '#4a3520';
        } else if (noiseValue < 0.75) {
          color = '#6b4c2a';
        } else {
          color = '#8b6914';
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }
  }

  /**
   * \u00041e\u000442\u00043e\u000440\u000430\u000436\u000435\u00043d\u000438\u000435 \u00043e\u000442\u00043b\u000430\u000434\u00043e\u000447\u00043d\u000430\u00044f \u000438\u00043d\u000444\u00043e\u000440\u00043c\u000430\u000446\u000438\u000438
   * @private
   */
  renderDebugInfo() {
    const ctx = this.ctx;
    
    ctx.save();
    ctx.resetTransform();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 250, 120);
    
    ctx.fillStyle = '#ffd700';
    ctx.font = '12px Arial';
    ctx.fillText(`FPS: ${Math.round(1000 / (performance.now() - (this.lastFrameTime || 0)))}`, 20, 30);
    ctx.fillText(`State: ${this.state}`, 20, 50);
    ctx.fillText(`Resolution: ${this.width}x${this.height}`, 20, 70);
    ctx.fillText(`Debug: ON`, 20, 90);
    
    ctx.restore();
    
    this.lastFrameTime = performance.now();
  }

  /**
   * \u00041f\u000440\u000438\u00043e\u000441\u000442\u000430\u00043d\u00043e\u000432\u00043a\u000430 38\u000433\u000440\u00044b
   */
  pause() {
    this.state = 'paused';
    this.gameLoop.stop();
    this.events.emit('game:pause');
    console.log('Game paused');
  }

  /**
   * \u00041f\u000440\u00043e\u000434\u00043e\u00043b\u000436\u000435\u00043d\u000438\u000435 38\u000433\u000440\u00044b
   */
  resume() {
    this.state = 'playing';
    this.gameLoop.start();
    this.events.emit('game:resume');
    console.log('Game resumed');
  }

  /**
   * \u00041f\u000435\u000440\u000435\u00043a\u00043b\u00044e\u000447\u000435\u00043d\u000438\u000435 3f\u000430\u000443374b
   */
  togglePause() {
    if (this.state === 'playing') {
      this.pause();
    } else if (this.state === 'paused') {
      this.resume();
    }
  }

  /**
   * \u000417\u000430\u000432\u000435\u000440\u000448\u000438\u000442\u00044c \u000438\u000433\u000440\u000443
   */
  stop() {
    this.state = 'stopped';
    this.gameLoop.stop();
    this.events.emit('game:stop');
    console.log('Game stopped');
  }

  /**
   * \u00041f\u00043e\u00043b\u000443\u000447\u000435\u00043d\u000438\u000435 \u000438\u00043d\u000444\u00043e\u000440\u00043c\u000430\u000446\u000438\u00044f \u00043e \u000432\u00044b\u000439\u000433\u000440\u000430\u000435
   */
  getGameInfo() {
    return {
      state: this.state,
      width: this.width,
      height: this.height,
      debugMode: this.debugMode,
      frameTime: this.lastFrameTime
    };
  }
}
