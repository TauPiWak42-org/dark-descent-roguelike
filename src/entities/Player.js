/**
 * \u00041a\u00043b\u000430\u000441\u000441 \u000438\u000433\u000440\u00043e\u00043a\u000430
 * \u000423\u00043f\u000440\u000430\u000432\u00043b\u00044f\u000435\u000442 \u000434\u000432\u000438\u000436\u000435\u00043d\u000438\u00044f, \u000437\u000434\u00043e\u000440\u00043e\u000432\u00044c\u000435\u00043c \u000438 \u000440\u000435\u000441\u000443\u000440\u000441\u000430\u00043c\u000438 \u000438\u000433\u000440\u00043e\u00043a\u000430
 * TOPDOWN game - movement is relative to world, not camera
 * @class Player
 */
export class Player {
  constructor(game) {
    this.game = game;
    this.events = game.events;
    
    // \u00041f\u00043e\u000437\u000438\u000446\u000438\u00044f
    this.x = 400;
    this.y = 300;
    this.vx = 0;
    this.vy = 0;
    
    // \u000420\u000430\u000437\u00043c\u000435\u000440\u00044b
    this.width = 32;
    this.height = 32;
    
    // \u000425\u000430\u000440\u000430\u00043a\u000442\u000435\u000440\u000438\u000441\u000442\u000438\u00043a\u000438
    this.maxHealth = 100;
    this.health = 100;
    this.maxMana = 50;
    this.mana = 50;
    this.speed = 200;
    this.damage = 15;
    
    // \u000421\u00043e\u000441\u000442\u00043e\u00044f\u00043d\u000438\u00044f
    this.isMoving = false;
    this.facing = 'right';
    this.invulnerable = false;
    this.invulnerableTimer = 0;
    this.isAlive = true;
    
    // \u000420\u000435\u000441\u000443\u000440\u000441\u00044b
    this.gold = 0;
    this.souls = 0;
    this.floor = 1;
    
    // \u00041c\u000430\u00043d\u000430 \u000440\u000435\u000433\u000435\u00043d\u000435\u000440\u000430\u000446\u000438\u00044f
    this.manaRegenRate = 10; // \u00043c\u000430\u00043d\u000430 \u000432 \u000441\u000435\u00043a\u000443\u00043d\u000434\u000443
    this.manaRegenTimer = 0;
    
    // \u000421\u00043f\u000438\u000441\u00043e\u00043a \u000434\u00043b\u00044f \u00043e\u000447\u000438\u000441\u000442\u00043a\u000438 \u000441\u00043b\u000443\u000448\u000430\u000442\u000435\u00043b\u000435\u000439
    this.unsubscribers = [];
    
    this.setupEvents();
  }

  /**
   * \u00041e\u000447\u000438\u000441\u000442\u00043a\u000430 \u000441\u00043b\u000443\u000448\u000430\u000442\u000435\u00043b\u000435\u000439
   */
  cleanup() {
    for (const unsubscribe of this.unsubscribers) {
      unsubscribe();
    }
    this.unsubscribers = [];
  }

  /**
   * \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u000441\u00043e\u000431\u00044b\u000442\u000438\u000439
   * @private
   */
  setupEvents() {
    const unsubscribeUpdate = this.events.on('game:update', (deltaTime) => this.update(deltaTime));
    const unsubscribeRender = this.events.on('game:render', (ctx) => this.render(ctx));
    this.unsubscribers.push(unsubscribeUpdate, unsubscribeRender);
  }

  /**
   * \u00041e\u000431\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u000441\u00043e\u000441\u000442\u00043e\u00044f\u00043d\u000438\u00044f \u000438\u000433\u000440\u00043e\u00043a\u000430
   * @param {number} deltaTime - \u000412\u000440\u000435\u00043c\u00044f \u000441 \u00043f\u000440\u00043e\u000448\u00043b\u00043e\u000433\u00043e \u00043a\u000430\u000434\u000440\u000430 \u000432 \u000441\u000435\u00043a\u000443\u00043d\u000434\u000430\u000445
   */
  update(deltaTime) {
    if (!this.isAlive) return;
    
    // \u000412\u00043e\u000441\u000442\u000430\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u00043c\u000430\u00043d\u00044b
    this.manaRegenTimer += deltaTime;
    if (this.manaRegenTimer >= 1 && this.mana < this.maxMana) {
      this.mana = Math.min(this.maxMana, this.mana + this.manaRegenRate * deltaTime);
      this.manaRegenTimer = 0;
      this.events.emit('player:mana', { mana: this.mana });
    }
    
    // \u000421\u000431\u000440\u00043e\u000441 \u000441\u00043a\u00043e\u000440\u00043e\u000441\u000442\u000438
    this.vx = 0;
    this.vy = 0;
    
    // TOPDOWN: \u000418\u000441\u00043f\u00043e\u00043b\u00044c\u000437\u00043e\u000432\u000430\u00043d\u000438\u000435 InputManager \u000434\u00043b\u00044f \u000432\u000432\u00043e\u000434\u000430
    if (this.game.input) {
      if (this.game.input.isKeyDown('w') || this.game.input.isKeyDown('\u000446')) this.vy = -this.speed;
      if (this.game.input.isKeyDown('s') || this.game.input.isKeyDown('\u00044b')) this.vy = this.speed;
      if (this.game.input.isKeyDown('a') || this.game.input.isKeyDown('\u000444')) {
        this.vx = -this.speed;
        this.facing = 'left';
      }
      if (this.game.input.isKeyDown('d') || this.game.input.isKeyDown('\u000442')) {
        this.vx = this.speed;
        this.facing = 'right';
      }
    }
    
    // \u00041d\u00043e\u000440\u00043c\u000430\u00043b\u000438\u000437\u000430\u000446\u000438\u00044f \u000434\u000432\u000438\u000436\u000435\u00043d\u000438\u00044f \u000434\u000432\u000430\u000434\u00044c\u00044e
    if (this.vx !== 0 && this.vy !== 0) {
      this.vx *= Math.SQRT1_2;
      this.vy *= Math.SQRT1_2;
    }
    
    // \u00041e\u000431\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u00043f\u00043e\u000437\u000438\u000446\u000438\u000438
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    
    // \u00041e\u000433\u000440\u000430\u00043d\u000438\u000447\u000435\u00043d\u000438\u000435 \u00043f\u00043e \u00044d\u00043a\u000440\u000430\u00043d\u000443
    this.x = Math.max(0, Math.min(this.game.width - this.width, this.x));
    this.y = Math.max(0, Math.min(this.game.height - this.height, this.y));
    
    // \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u000434\u000432\u000438\u000436\u000435\u00043d\u000438\u00044f
    this.isMoving = this.vx !== 0 || this.vy !== 0;
    
    // \u000422\u000430\u000439\u00043c\u000435\u000440 \u00043d\u000435\u000443\u00044f\u000437\u000432\u000438\u00043c\u00043e\u000441\u000442\u00044c\u00044e
    if (this.invulnerable) {
      this.invulnerableTimer -= deltaTime;
      if (this.invulnerableTimer <= 0) {
        this.invulnerable = false;
      }
    }
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u00043a\u000430 \u000438\u000433\u000440\u00043e\u00043a\u000430
   * @param {CanvasRenderingContext2D} ctx - \u00041a\u00043e\u00043d\u000442\u000435\u00043a\u000441\u000442 canvas
   */
  render(ctx) {
    if (!this.isAlive) return;
    
    // \u00041c\u000438\u000433\u000430\u00043d\u000438\u000435 \u00043f\u000440\u000438 \u00043d\u000435\u000443\u00044f\u000437\u000432\u000438\u00043c\u00043e\u000441\u000442\u000438
    if (this.invulnerable && Math.floor(this.invulnerableTimer * 10) % 2 === 0) {
      return;
    }
    
    ctx.save();
    
    // \u000422\u000435\u00043d\u00044c
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(this.x, this.y + this.height - 4, this.width, 4);
    
    // \u000422\u000435\u00043b\u00043e \u000441 \u000433\u000440\u000430\u000434\u000438\u000435\u00043d\u000442\u00043e\u00043c
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, '#4a3520');
    gradient.addColorStop(0.5, '#6b4c2a');
    gradient.addColorStop(1, '#3d2b1a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // \u000417\u00043e\u00043b\u00043e\u000442\u000430\u00044f \u00043e\u00043a\u000430\u00043d\u000442\u00043e\u000432\u00043a\u000430
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // \u000413\u00043b\u000430\u000437\u000430
    ctx.fillStyle = '#ffd700';
    const eyeY = this.y + 10;
    const eyeOffset = this.facing === 'right' ? 22 : 4;
    
    ctx.fillRect(this.x + eyeOffset, eyeY, 6, 6);
    ctx.fillRect(this.x + eyeOffset, eyeY + 12, 6, 6);
    
    // \u000421\u000432\u000435\u000447\u000435\u00043d\u000438\u000435 \u000433\u00043b\u000430\u000437
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 5;
    ctx.fillRect(this.x + eyeOffset, eyeY, 6, 6);
    ctx.fillRect(this.x + eyeOffset, eyeY + 12, 6, 6);
    ctx.shadowBlur = 0;
    
    ctx.restore();
  }

  /**
   * \u00041f\u00043e\u00043b\u000443\u000447\u000435\u00043d\u000438\u000435 \u000443\u000440\u00043e\u00043d\u000430
   * @param {number} damage - \u00041a\u00043e\u00043b\u000438\u000447\u000435\u000441\u000442\u000432\u00043e \u000443\u000440\u00043e\u00043d\u000430
   */
  takeDamage(damage) {
    if (this.invulnerable || !this.isAlive) return;
    
    this.health -= damage;
    this.invulnerable = true;
    this.invulnerableTimer = 1;
    
    this.events.emit('player:damaged', { damage, health: this.health });
    
    if (this.health <= 0) {
      this.health = 0;
      this.die();
    }
  }

  /**
   * \u00041b\u000435\u000447\u000435\u00043d\u000438\u000435 \u000438\u000433\u000440\u00043e\u00043a\u000430
   * @param {number} amount - \u00041a\u00043e\u00043b\u000438\u000447\u000435\u000441\u000442\u000432\u00043e \u000437\u000434\u00043e\u000440\u00043e\u000432\u00044c\u00044f
   */
  heal(amount) {
    if (!this.isAlive) return;
    
    const oldHealth = this.health;
    this.health = Math.min(this.maxHealth, this.health + amount);
    const healedAmount = this.health - oldHealth;
    
    if (healedAmount > 0) {
      this.events.emit('player:healed', { amount: healedAmount, health: this.health });
    }
  }

  /**
   * \u000412\u00043e\u000441\u000442\u000430\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u00043c\u000430\u00043d\u00044b
   * @param {number} amount - \u00041a\u00043e\u00043b\u000438\u000447\u000435\u000441\u000442\u000432\u00043e \u00043c\u000430\u00043d\u00044b
   */
  restoreMana(amount) {
    if (!this.isAlive) return;
    
    this.mana = Math.min(this.maxMana, this.mana + amount);
    this.events.emit('player:mana', { amount, mana: this.mana });
  }

  /**
   * \u000414\u00043e\u000431\u000430\u000432\u00043b\u000435\u00043d\u000438\u000435 \u000437\u00043e\u00043b\u00043e\u000442\u000430
   * @param {number} amount - \u00041a\u00043e\u00043b\u000438\u000447\u000435\u000441\u000442\u000432\u00043e \u000437\u00043e\u00043b\u00043e\u000442\u000430
   */
  addGold(amount) {
    this.gold += amount;
    this.events.emit('player:gold', { amount, gold: this.gold });
  }

  /**
   * \u000414\u00043e\u000431\u000430\u000432\u00043b\u000435\u00043d\u000438\u000435 \u000434\u000443\u000448
   * @param {number} amount - \u00041a\u00043e\u00043b\u000438\u000447\u000435\u000441\u000442\u000432\u00043e \u000434\u000443\u000448
   */
  addSouls(amount) {
    this.souls += amount;
    this.events.emit('player:souls', { amount, souls: this.souls });
  }

  /**
   * \u000421\u00043c\u000435\u000440\u000442\u00044c \u000438\u000433\u000440\u00043e\u00043a\u000430
   */
  die() {
    this.isAlive = false;
    this.events.emit('player:died');
    this.game.gameOver();
  }
}
