/**
 * \u000421\u000438\u000441\u000442\u000435\u00043c\u000430 \u000447\u000430\u000441\u000442\u000438\u000446
 * \u00041e\u000442\u000432\u000435\u000447\u000430\u000435\u000442 \u000437\u000430 \u000447\u000430\u000441\u000438\u000442\u000430\u00043b\u000438\u000446\u00043a\u00043c
 * \u000426\u000432\u000435\u000442\u000430\u00044f \u000438\u000434\u000444\u000435\u00043a\u000442\u000430\u000432: #1a1a2e, #16213e, #1f1f2e
 * \u000417\u00043e\u00043b\u00043e\u000442\u000430: #d4af37, #ffd700, #8b6914
 * \u00041d\u000435\u00043b\u000435\u00043d\u000442\u00044b: \u00043e\u000433\u00043e\u00043d\u00044c #ff6b35, \u00043b\u000451\u000434 #7ec8e3, \u00044f\u000434 #7cb342, \u00043a\u000440\u00043e\u000432\u00044c #8b0000, \u000434\u000443\u000448\u000438 #9b59b6
 * @class ParticleSystem
 */
export class ParticleSystem {
  constructor(game) {
    this.game = game;
    this.events = game.events;
    this.particles = [];
    this.maxParticles = 200;
    
    this.setupEvents();
  }

  /**
   * \u00041e\u000447\u000438\u000441\u000442\u00043a\u000430 \u000441\u00043b\u000443\u000448\u000430\u000442\u000435\u00043b\u000435\u000439
   */
  cleanup() {
    for (const unsubscribe of this.unsubscribers || []) {
      unsubscribe();
    }
    this.unsubscribers = [];
    this.particles = [];
  }

  /**
   * \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u000441\u00043e\u000431\u00044b\u000442\u000438\u000439
   * @private
   */
  setupEvents() {
    this.unsubscribers = [];
    const unsubscribeUpdate = this.events.on('game:update', (deltaTime) => this.update(deltaTime));
    const unsubscribeRender = this.events.on('game:render', (ctx) => this.render(ctx));
    
    // Listen for effect events
    const unsubscribeDamage = this.events.on('effect:damage', (data) => this.createDamageEffect(data.x, data.y));
    const unsubscribeHeal = this.events.on('effect:heal', (data) => this.createHealEffect(data.x, data.y));
    const unsubscribeGold = this.events.on('effect:gold', (data) => this.createGoldEffect(data.x, data.y, data.amount));
    const unsubscribeSoul = this.events.on('effect:soul', (data) => this.createSoulEffect(data.x, data.y, data.amount));
    
    this.unsubscribers.push(unsubscribeUpdate, unsubscribeRender, unsubscribeDamage, unsubscribeHeal, unsubscribeGold, unsubscribeSoul);
  }

  /**
   * \u00041e\u000431\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u000441\u00043e\u000441\u000442\u00043e\u00044f\u00043d\u000438\u00044f
   * @param {number} deltaTime
   */
  update(deltaTime) {
    // Update all particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * deltaTime * 60;
      p.y += p.vy * deltaTime * 60;
      p.life -= deltaTime;
      
      // Remove dead particles
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
    
    // Add ambient particles (floating dust)
    if (Math.random() < 0.05 && this.particles.length < this.maxParticles) {
      this.createDustParticle();
    }
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u000447\u000430\u000441\u000442\u000438\u000446\u00044b
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    ctx.save();
    
    for (const p of this.particles) {
      ctx.globalAlpha = p.alpha * Math.min(1, p.life * 5);
      ctx.fillStyle = p.color;
      
      if (p.type === 'spark') {
        // \u000418\u000441\u00043a\u000440\u00044b\u000442\u000430\u00044b
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // \u000421\u000432\u000435\u000442\u00043b\u00044b\u00043e\u000435 \u000437\u00043e\u00043b\u00043e\u000442\u000430\u00044b
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(p.x - 1, p.y - 1, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'smoke') {
        // \u000414\u00044b\u00043c
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'glow') {
        // \u000421\u000432\u000435\u000442\u00043b\u00044b\u00043e\u000435 \u000441\u000432\u000435\u000442\u000430\u00043d\u000438\u00044f
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }

  /**
   * \u000421\u00043e\u000437\u000434\u000430\u00043d\u000438\u000435 \u000447\u000430\u000441\u000442\u000438\u000446\u000443\u00044b \u00043f\u00044b\u00043b\u000438
   * @private
   */
  createDustParticle() {
    if (this.particles.length >= this.maxParticles) return;
    
    const camera = this.game.camera || { x: 0, y: 0 };
    const x = camera.x + Math.random() * this.game.width;
    const y = camera.y + Math.random() * this.game.height;
    
    this.particles.push({
      type: 'smoke',
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10 - 5,
      life: 5 + Math.random() * 5,
      size: 2 + Math.random() * 4,
      color: 'rgba(139, 105, 20, 0.3)',
      alpha: 0.6
    });
  }

  /**
   * \u000421\u00043e\u000437\u000434\u000430\u00043d\u000438\u000435 \u00044d\u000444\u000444\u000435\u00043a\u000442 \u00043f\u000440\u000438 \u00043f\u00043e\u00043b\u000443\u000447\u000435\u00043d\u000438\u00044f \u000443\u000442\u000430\u000434\u000430\u00043a
   * \u000426\u000432\u000435\u000442: \u00043a\u000440\u000430\u000432\u00044c #8b0000
   * @param {number} x
   * @param {number} y
   */
  createDamageEffect(x, y) {
    // \u00041a\u000440\u000430\u000441\u00043d\u00044b\u000439 \u000441\u000432\u000435\u000442\u00043b\u00044b\u00043e\u000435 \u000443\u000434\u000430\u000440\u000430
    for (let i = 0; i < 10; i++) {
      if (this.particles.length >= this.maxParticles) break;
      
      this.particles.push({
        type: 'spark',
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 200,
        vy: (Math.random() - 0.5) * 200 - 50,
        life: 0.5 + Math.random() * 0.5,
        size: 2 + Math.random() * 3,
        color: '#ff6b35',
        alpha: 1
      });
    }
    
    // \u00041a\u000440\u000430\u000441\u00043d\u00044b\u000439 \u000432\u000441\u00043f\u00044b\u000448\u00043a\u000430\u000432\u000430\u000435 \u000441\u000432\u000435\u000442\u000430
    this.particles.push({
      type: 'glow',
      x: x,
      y: y,
      vx: 0,
      vy: 0,
      life: 0.3,
      size: 20,
      color: 'rgba(255, 107, 53, 0.3)',
      alpha: 0.5
    });
  }

  /**
   * \u000421\u00043e\u000437\u000434\u000430\u00043d\u000438\u000435 \u00044d\u000444\u000444\u000435\u00043a\u000442 \u00043f\u000440\u000438 \u00043b\u000435\u000447\u000435\u00043d\u000438\u000438
   * \u000426\u000432\u000435\u000442: \u00043b\u000451\u000434 #7ec8e3
   * @param {number} x
   * @param {number} y
   */
  createHealEffect(x, y) {
    // \u000417\u00043e\u00043b\u00043e\u000442\u00044b\u000435 \u000438\u000441\u00043a\u000440\u00044b\u000442\u000430
    for (let i = 0; i < 8; i++) {
      if (this.particles.length >= this.maxParticles) break;
      
      this.particles.push({
        type: 'spark',
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 150,
        vy: (Math.random() - 0.5) * 150 - 30,
        life: 0.6 + Math.random() * 0.4,
        size: 2 + Math.random() * 2,
        color: '#7ec8e3',
        alpha: 1
      });
    }
    
    // \u000417\u00043e\u00043b\u00043e\u000442\u00044b\u000439 \u000441\u000432\u000435\u000442
    this.particles.push({
      type: 'glow',
      x: x,
      y: y,
      vx: 0,
      vy: 0,
      life: 0.4,
      size: 15,
      color: 'rgba(126, 200, 227, 0.4)',
      alpha: 0.6
    });
  }

  /**
   * \u000421\u00043e\u000437\u000434\u000430\u00043d\u000438\u000435 \u00044d\u000444\u000444\u000435\u00043a\u000442 \u00043f\u000440\u000438 \u000441\u000431\u00043e\u000440\u000435 \u000437\u00043e\u00043b\u00043e\u000442\u000430
   * \u000426\u000432\u000435\u000442: \u000437\u00043e\u00043b\u00043e\u000442\u000430\u00044b #d4af37, #ffd700
   * @param {number} x
   * @param {number} y
   * @param {number} amount
   */
  createGoldEffect(x, y, amount) {
    const particleCount = Math.min(15, amount / 2 + 5);
    
    for (let i = 0; i < particleCount; i++) {
      if (this.particles.length >= this.maxParticles) break;
      
      this.particles.push({
        type: 'spark',
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 100,
        vy: (Math.random() - 0.5) * 100 - 20,
        life: 1 + Math.random() * 0.5,
        size: 2 + Math.random() * 2,
        color: Math.random() < 0.5 ? '#d4af37' : '#ffd700',
        alpha: 1
      });
    }
    
    // \u000417\u00043e\u00043b\u00043e\u000442\u00044b\u000439 \u000441\u000432\u000435\u000442
    this.particles.push({
      type: 'glow',
      x: x,
      y: y,
      vx: 0,
      vy: 0,
      life: 0.5,
      size: 20,
      color: 'rgba(255, 215, 0, 0.3)',
      alpha: 0.5
    });
  }

  /**
   * \u000421\u00043e\u000437\u000434\u000430\u00043d\u000438\u000435 \u00044d\u000444\u000444\u000435\u00043a\u000442 \u00043f\u000440\u000438 \u000441\u000431\u00043e\u000440\u000435 \u000434\u000443\u000448
   * \u000426\u000432\u000435\u000442: \u000434\u000443\u000448\u000438 #9b59b6
   * @param {number} x
   * @param {number} y
   * @param {number} amount
   */
  createSoulEffect(x, y, amount) {
    const particleCount = Math.min(12, amount + 5);
    
    for (let i = 0; i < particleCount; i++) {
      if (this.particles.length >= this.maxParticles) break;
      
      this.particles.push({
        type: 'spark',
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 80,
        vy: (Math.random() - 0.5) * 80 - 15,
        life: 1.2 + Math.random() * 0.6,
        size: 2 + Math.random() * 3,
        color: '#9b59b6',
        alpha: 1
      });
    }
    
    // \u000417\u00043e\u00043b\u00043e\u000442\u00044b\u000439 \u000441\u000432\u000435\u000442
    this.particles.push({
      type: 'glow',
      x: x,
      y: y,
      vx: 0,
      vy: 0,
      life: 0.6,
      size: 25,
      color: 'rgba(155, 89, 182, 0.3)',
      alpha: 0.5
    });
  }

  /**
   * \u000421\u00043e\u000437\u000434\u000430\u00043d\u000438\u000435 \u000444\u000430\u00043a\u000435\u00043b \u000441 \u000434\u00043b\u000430\u00043c\u000435\u00043d\u00044c\u00043c\u000442\u000432\u000435
   * @param {number} x
   * @param {number} y
   */
  createTorchEffect(x, y) {
    // \u00041f\u00043b\u000430\u00043c\u00044f \u000444\u000430\u00043a\u000435\u00043b
    this.particles.push({
      type: 'glow',
      x: x,
      y: y - 20,
      vx: 0,
      vy: Math.sin(Date.now() * 0.001) * 2,
      life: 100, // Long lived
      size: 30,
      color: 'rgba(255, 107, 53, 0.2)',
      alpha: 0.3
    });
    
    // \u000418\u000441\u00043a\u000440\u00044b\u000442\u000430\u00044b
    if (Math.random() < 0.1) {
      this.particles.push({
        type: 'spark',
        x: x,
        y: y - 20,
        vx: (Math.random() - 0.5) * 30,
        vy: -Math.random() * 20,
        life: 0.5 + Math.random() * 0.3,
        size: 1 + Math.random() * 2,
        color: '#ff6b35',
        alpha: 1
      });
    }
  }
}
