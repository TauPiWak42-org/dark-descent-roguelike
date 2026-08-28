import { EventSystem } from './EventSystem.js';
import { GameLoop } from './GameLoop.js';

/**
 * \u000413\u00043b\u000430\u000432\u00043d\u00044b\u000439 \u00043a\u00043b\u000430\u000441\u000441 \u000438\u000433\u000440\u00044b
 * \u000423\u00043f\u000440\u000430\u000432\u00043b\u00044f\u000435\u000442 \u000441\u00043e\u000441\u000442\u000435\u00043c\u000438 \u000438\u000433\u000440\u00044b \u000438 \u00043a\u00043e\u00043e\u000440\u000434\u000438\u00043d\u000438\u000440\u000443 \u000441\u000438\u000441\u000442\u000435\u00043c\u000430\u00043c
 * TOPDOWN game - world is larger than screen, camera follows player
 * \u000426\u000432\u000435\u000442\u000430\u00044f \u00043f\u000430\u00043b\u000438\u000442\u000430: #1a1a2e, #16213e, #1f1f2e
 * \u000417\u00043e\u00043b\u00043e\u000442\u000430: #d4af37, #ffd700, #8b6914
 * \u000422\u000435\u00043c\u00043d\u00044b\u000435 \u000430\u00043a\u000446\u000435\u00043d\u000442\u00044b: #2d1b00, #4a3520, #6b4c2a
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
    
    // \u000418\u00043d\u000438\u000446\u000438\u000430\u00043b\u000438\u000437\u000430\u000446\u000438\u00044b \u000432\u000440\u000435\u00043c\u000435\u00043d\u000438 \u00043e\u000442\u000440\u000430\u000434\u00043a\u000430 FPS
    this.lastFrameTime = 0;
    
    // TOPDOWN: World size is larger than viewport
    this.worldWidth = 2000;
    this.worldHeight = 2000;
    
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
   * \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u000438\u000433\u000440\u00043e\u000432\u00043e\u000439\u00043e \u000446\u000438\u00043a\u00043b
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
    this.handleKeyDown = (e) => {
      if (e.key === 'F3') {
        this.debugMode = !this.debugMode;
        console.log(`Debug mode: ${this.debugMode ? 'ON' : 'OFF'}`);
      }
      
      if (e.key === 'Escape') {
        this.togglePause();
      }
    };
    
    window.addEventListener('keydown', this.handleKeyDown);
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
   * \u00041e\u000431\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u000438\u000433\u000440\u00044b
   * @param {number} deltaTime - \u000412\u000440\u000435\u00043c\u00044f \u000441 \u00043f\u000440\u00043e\u000448\u00043b\u00043e\u000434\u00043e \u00043a\u000430\u000434\u000440\u000430 \u000432 \u000441\u000435\u00043a\u000443\u000434\u000430\u000445
   */
  update(deltaTime) {
    if (this.state !== 'playing') return;
    
    this.events.emit('game:update', deltaTime);
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u000438\u000433\u000440\u000443
   * TOPDOWN: Only render background once, game entities are rendered with camera transform
   */
  render() {
    // Clear entire canvas with dark background
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Render cave background (only once, not transformed)
    this.renderCaveBackground();
    
    // Render game entities with camera transform
    this.events.emit('game:render', this.ctx);
    
    // Add subtle vignette effect
    this.renderVignette();
    
    // Debug info overlay
    if (this.debugMode) {
      this.renderDebugInfo();
    }
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u000444\u00043e\u00043d\u000430\u000432\u00044b \u00043f\u000435\u000449\u000435\u000440\u00043d\u000438\u00044b \u000448\u000443\u00043c
   * \u000418\u000441\u00043f\u00043e\u00043b\u00044c\u000437\u00043e\u000432\u000430\u00044b Perlin \u000448\u000443\u00043c \u000434\u00043b\u00044f \u000442\u000435\u00043a\u000441\u000442\u000443\u000440\u00044b
   * \u000426\u000432\u000435\u000442: #1a1a2e, #16213e, #1f1f2e
   * @private
   */
  renderCaveBackground() {
    const ctx = this.ctx;
    const tileSize = 64;
    
    // TOPDOWN: Render background based on camera position
    const camera = this.camera || { x: 0, y: 0 };
    const startX = Math.floor(camera.x / tileSize) * tileSize;
    const startY = Math.floor(camera.y / tileSize) * tileSize;
    
    for (let y = startY; y < camera.y + this.height + tileSize; y += tileSize) {
      for (let x = startX; x < camera.x + this.width + tileSize; x += tileSize) {
        const noiseX = x * 0.02;
        const noiseY = y * 0.02;
        const noiseValue = Math.sin(noiseX) * Math.cos(noiseY) * 0.5 + 0.5;
        
        let color;
        if (noiseValue < 0.3) {
          color = '#16213e';
        } else if (noiseValue < 0.45) {
          color = '#1a1a2e';
        } else if (noiseValue < 0.6) {
          color = '#1f1f2e';
        } else if (noiseValue < 0.75) {
          color = '#2d1b00';
        } else {
          color = '#4a3520';
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(x - camera.x, y - camera.y, tileSize, tileSize);
        
        // \u000410\u000442\u00043c\u00043e\u000441\u000444\u000435\u000440\u00043d\u00044b\u000435 \u000448\u000443\u00043c: \u000437\u00043e\u00043b\u00043e\u000442\u00044b\u000435 \u00043f\u000440\u00043e\u000436\u000438\u00043b\u00043a\u000438
        if (Math.random() < 0.02) {
          ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
          ctx.fillRect(x - camera.x + Math.random() * 40, y - camera.y + Math.random() * 40, 8, 8);
        }
      }
    }
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u00043b\u000435\u000433\u00043a\u000443\u00044e \u000432\u000438\u00043d\u00044c\u000435\u000442\u000442\u000443
   * \u000426\u000432\u000435\u000442: rgba(0, 0, 0, 0.5)
   * @private
   */
  renderVignette() {
    const ctx = this.ctx;
    const gradient = ctx.createRadialGradient(
      this.width / 2, this.height / 2, 0,
      this.width / 2, this.height / 2, Math.max(this.width, this.height) * 1.5
    );
    
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * \u00041e\u000442\u000440\u000430\u000442\u00044c \u00043e\u000442\u00043b\u000430\u000434\u00043e\u000447\u00043d\u000430\u00044f \u000438\u00043d\u000444\u00043e\u000440\u00043c\u000430\u000446\u000438\u000438
   * @private
   */
  renderDebugInfo() {
    const ctx = this.ctx;
    
    ctx.save();
    ctx.resetTransform();
    
    ctx.fillStyle = 'rgba(26, 26, 46, 0.7)';
    ctx.fillRect(10, 10, 250, 120);
    
    ctx.fillStyle = '#ffd700';
    ctx.font = '12px Arial';
    ctx.fillText(`FPS: ${Math.round(1000 / (performance.now() - (this.lastFrameTime || 16)))}`, 20, 30);
    ctx.fillText(`State: ${this.state}`, 20, 50);
    ctx.fillText(`Resolution: ${this.width}x${this.height}`, 20, 70);
    ctx.fillText(`Debug: ON`, 20, 90);
    
    ctx.restore();
    
    this.lastFrameTime = performance.now();
  }

  /**
   * \u00041f\u000440\u00043e\u000441\u000442\u000430\u000432\u00043a\u000430 \u000438\u000433\u000440\u00044b
   */
  pause() {
    this.state = 'paused';
    this.gameLoop.stop();
    this.events.emit('game:pause');
    console.log('Game paused');
  }

  /**
   * \u00041f\u000440\u00043e\u000434\u00043e\u00043b\u000436\u000435\u00043d\u000438\u000435 \u000438\u000433\u000440\u00044b
   */
  resume() {
    this.state = 'playing';
    this.gameLoop.start();
    this.events.emit('game:resume');
    console.log('Game resumed');
  }

  /**
   * \u00041f\u000435\u000440\u000435\u00043a\u00043b\u00044e\u000447\u000435\u00043d\u000438\u000435 \u00043f\u000430\u000443\u000437\u00044b
   */
  togglePause() {
    if (this.state === 'playing') {
      this.pause();
    } else if (this.state === 'paused') {
      this.resume();
    }
  }

  /**
   * \u000417\u000430\u00043a\u000430\u00043d\u000438\u000435 \u000438\u000433\u000440\u000443
   */
  stop() {
    this.state = 'stopped';
    this.gameLoop.stop();
    window.removeEventListener('keydown', this.handleKeyDown);
    // Очистка InputManager для предотвращения утечки событий
    if (this.input && this.input.cleanup) {
      this.input.cleanup();
    }
    this.events.emit('game:stop');
    console.log('Game stopped');
  }

  /**
   * \u00041f\u00043e\u00043b\u000443\u000447\u000435\u00043d\u000438\u000435 \u000438\u00043d\u000444\u00043e\u000440\u00043c\u000430\u000446\u000438\u00044f \u00043e \u000432\u00044b\u000439\u000430\u000440
   */
  getGameInfo() {
    return {
      state: this.state,
      width: this.width,
      height: this.height,
      debugMode: this.debugMode,
      frameTime: this.lastFrameTime,
      worldWidth: this.worldWidth,
      worldHeight: this.worldHeight
    };
  }

  /**
   * \u000413\u000430\u00043c\u000435 \u00043e\u000432\u000435\u000440
   */
  gameOver() {
    this.state = 'gameover';
    this.events.emit('game:gameover');
    console.log('Game Over');
  }
}
