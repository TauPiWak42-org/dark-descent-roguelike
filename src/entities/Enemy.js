/**
 * \u0411\u0430\u0437\u043e\u0432\u044b\u0439 \u043a\u043b\u0430\u0441\u0441 \u0432\u0440\u0430\u0433\u0430
 * @class Enemy
 */
export class Enemy {
  /**
   * @param {Game} game - \u0421\u0441\u044b\u043b\u043a\u0430 \u043d\u0430 \u0438\u0433\u0440\u0443
   * @param {number} x - \u041f\u043e\u0437\u0438\u0446\u0438\u044f X
   * @param {number} y - \u041f\u043e\u0437\u0438\u0446\u0438\u044f Y
   * @param {string} type - \u0422\u0438\u043f \u0432\u0440\u0430\u0433\u0430
   */
  constructor(game, x, y, type = 'skeleton') {
    this.game = game;
    this.events = game.events;
    
    // \u041f\u043e\u0437\u0438\u0446\u0438\u044f
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    
    // \u0420\u0430\u0437\u043c\u0435\u0440\u044b
    this.width = 28;
    this.height = 28;
    
    // \u0422\u0438\u043f \u0438 \u0445\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043a\u0438
    this.type = type;
    this.setupStats();
    
    // \u0421\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435
    this.isAlive = true;
    this.isAggressive = false;
    this.attackCooldown = 0;
    this.hitCooldown = 0;
    this.wanderTimer = 0;
    this.wanderAngle = Math.random() * Math.PI * 2;
    
    // \u0426\u0435\u043b\u044c
    this.target = null;
  }

  /**
   * \u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430 \u0445\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043a \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u0438 \u043e\u0442 \u0442\u0438\u043f\u0430
   * @private
   */
  setupStats() {
    const stats = {
      skeleton: {
        maxHealth: 30, health: 30, damage: 10, speed: 50,
        attackRange: 40, detectionRange: 200, soulValue: 1, goldValue: 5
      },
      zombie: {
        maxHealth: 50, health: 50, damage: 15, speed: 30,
        attackRange: 35, detectionRange: 150, soulValue: 2, goldValue: 8
      },
      demon: {
        maxHealth: 80, health: 80, damage: 20, speed: 70,
        attackRange: 60, detectionRange: 250, soulValue: 5, goldValue: 20
      },
      ghost: {
        maxHealth: 40, health: 40, damage: 12, speed: 90,
        attackRange: 50, detectionRange: 300, soulValue: 3, goldValue: 12
      }
    };
    
    const s = stats[this.type] || stats.skeleton;
    Object.assign(this, s);
  }

  /**
   * \u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430 \u0446\u0435\u043b\u0438 \u0434\u043b\u044f \u043f\u0440\u0435\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u044f
   * @param {Player} player - \u0418\u0433\u0440\u043e\u043a
   */
  setTarget(player) {
    this.target = player;
  }

  /**
   * \u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435 \u0441\u043e\u0441\u0444\u043e\u044f\u043d\u0438\u044f \u0432\u0440\u0430\u0433\u0430
   * @param {number} deltaTime - \u0412\u0440\u0435\u043c\u044f \u0441 \u043f\u0440\u043e\u0448\u043b\u043e\u0433\u043e \u043a\u0430\u0434\u0440\u0430
   */
  update(deltaTime) {
    if (!this.isAlive || !this.target) return;
    
    // \u0421\u0431\u0440\u043e\u0441 \u0441\u043a\u043e\u0440\u043e\u0441\u0442\u0438
    this.vx = 0;
    this.vy = 0;
    
    // \u0420\u0430\u0441\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u0434\u043f \u0446\u0435\u043b\u0438
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // \u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u043e\u0431\u043d\u0430\u0440\u0443\u0436\u0435\u043d\u0438\u044f
    if (distance < this.detectionRange) {
      this.isAggressive = true;
    }
    
    if (this.isAggressive) {
      // \u041f\u0440\u0435\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u0435
      if (distance > this.attackRange) {
        const angle = Math.atan2(dy, dx);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
      }
      
      // \u0410\u0442\u0430\u043a\u0430
      if (distance <= this.attackRange && this.attackCooldown <= 0) {
        this.attack();
        this.attackCooldown = 1;
      }
    } else {
      // \u0421\u043b\u0441\u0443\u0447\u0430\u0439\u043d\u043e\u0435 \u0431\u043b\u0443\u0436\u0434\u0430\u043d\u0438\u0435
      this.wander(deltaTime);
    }
    
    // \u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u043e\u0437\u0438\u0446\u0438\u0438
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    
    // \u041e\u0431\u043d\u043e\u0432\u043c\u0435\u043d\u0438\u0435 \u043a\u0443\u043c\u0434\u0430\u0443\u043d\u043f\u0432
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
    if (this.hitCooldown > 0) {
      this.hitCooldown -= deltaTime;
    }
  }

  /**
   * \u0421\u043c\u0435\u0440\u0442\u044c \u0432\u0440\u0430\u0433\u0430
   */
  die() {
    this.isAlive = false;
    this.events.emit('enemy:died', { enemy: this });
  }

  /**
   * \u041e\u0442\u0440\u0438\u0441\u043e\u0432\u043b\u0430 \u0432\u0440\u0430\u0432\u0430
   * @param {CanvasRenderingContext2D} ctx - \u041a\u043e\u043d\u0442\u0435\u043b\u0441\u0442 canvas
   */
  render(ctx) {
    if (!this.isAlive) return;
    
    // \u0412\u044b\u0431\u043b\u043e\u0440 \u0446\u0432\u0435\u0442\u0430 \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u0438 \u043e\u0442 \u0442\u0438\u043f\u0430 \u0432\u0440\u0430\u0433\u0430
    let color;
    switch(this.type) {
      case 'skeleton': color = '#e0e0e0'; break;
      case 'zombie': color = '#2e8b57'; break;
      case 'demon': color = '#ff0000'; break;
      case 'ghost': color = '#9370db'; break;
      default: color = '#cccccc';
    }
    
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // \u0413\u0440\u0430\u043d\u0438\u0446\u0430
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}
