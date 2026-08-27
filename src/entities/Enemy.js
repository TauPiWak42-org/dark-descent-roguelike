/**
 * \u000411\u000430\u000437\u00043e\u000432\u00044b\u000439 \u00043a\u00043b\u000430\u000441\u000441 \u000432\u000440\u000430\u000433\u000430
 * @class Enemy
 */
export class Enemy {
  /**
   * @param {Game} game - \u000411\u000441\u00044b\u00043b\u00043a\u000430 \u00043d\u000430 \u000438\u000433\u000440\u000443
   * @param {number} x - \u00041f\u00043e\u000437\u000438\u000446\u000438\u00044f X
   * @param {number} y - \u00041f\u00043e\u000437\u000438\u000446\u000438\u00044f Y
   * @param {string} type - \u000422\u000438\u00043f \u000432\u000440\u000430\u000433\u000430
   */
  constructor(game, x, y, type = 'skeleton') {
    this.game = game;
    this.events = game.events;
    
    // \u00041f\u00043e\u000437\u000438\u000446\u000438\u00044f
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    
    // \u000420\u000430\u000437\u00043c\u000435\u000440\u00044b
    this.width = 28;
    this.height = 28;
    
    // \u000422\u000438\u00043f \u000438 \u000445\u000430\u000440\u000430\u00043a\u000442\u000435\u000440\u000438\u000441\u000442\u000438\u00043a\u000438
    this.type = type;
    this.setupStats();
    
    // \u000421\u00043e\u000441\u000442\u00043e\u00044f\u00043d\u000438\u000435
    this.isAlive = true;
    this.isAggressive = false;
    this.attackCooldown = 0;
    this.hitCooldown = 0;
    this.wanderTimer = 0;
    this.wanderAngle = Math.random() * Math.PI * 2;
    
    // \u000426\u000435\u00043b\u00044c
    this.target = null;
    
    // \u000426\u000432\u000435\u000442\u000430 \u000432\u000440\u000430\u000433\u000430 (40\u000430\u000441\u000448\u000435\u000442\u00043d\u00044b\u000435 32\u000440\u000430\u000433\u000438)
    this.color = this.getTypeColor();
  }

  /**
   * \u00041f\u00043e\u00043b\u000443\u000447\u000435\u00043d\u000438\u000435 \u000446\u000432\u000435\u000442\u000430 \u000432 \u000437\u000430\u000432\u000438\u000441\u000438\u00043c\u00043e\u000441\u000442\u000438 \u00043e\u000442 \u000442\u000438\u00043f\u000430 \u000432\u000440\u000430\u000433\u000430
   * @returns {string}
   * @private
   */
  getTypeColor() {
    const colors = {
      skeleton: '#ff6b6b',    // \u00041a\u000440\u000430\u000441\u00043d\u00044b\u000439
      zombie: '#ff6b6b',      // \u00041a\u000440\u000430\u000441\u00043d\u00044b\u000439
      demon: '#ff4757',       // \u00041a\u000440\u000430\u000441\u00043d\u00044b\u000439
      ghost: '#ff4757'       // \u00041a\u000440\u000430\u000441\u00043d\u00044b\u000439
    };
    return colors[this.type] || '#ff6b6b';
  }

  /**
   * \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u000445\u000430\u000440\u000430\u00043a\u000442\u000435\u000440\u000438\u000441\u000442\u000438\u00043a \u000432 \u000437\u000430\u000432\u000438\u000441\u000438\u00043c\u00043e\u000441\u000442\u000438 \u00043e\u000442 \u000442\u000438\u00043f\u000430
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
   * \u000423\u000441\u000442\u000430\u00043d\u00043e\u000432\u00043a\u000430 \u000446\u000435\u00043b\u000438 \u000434\u00043b\u00044f \u00043f\u000440\u000435\u000441\u00043b\u000435\u000434\u00043e\u000432\u000430\u00043d\u000438\u00044f
   * @param {Player} player - \u000418\u000433\u000440\u00043e\u00043a
   */
  setTarget(player) {
    this.target = player;
  }

  /**
   * \u00041e\u000431\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u000441\u00043e\u000441\u000442\u00043e\u00044f\u00043d\u000438\u00044f \u000432\u000440\u000430\u000433\u000430
   * @param {number} deltaTime - \u000412\u000440\u000435\u00043c\u00044f \u000441 \u00043f\u000440\u00043e\u000448\u00043b\u00043e\u000433\u00043e \u00043a\u000430\u000434\u000440\u000430
   */
  update(deltaTime) {
    if (!this.isAlive || !this.target) return;
    
    // \u000421\u000431\u000440\u00043e\u000441 \u000441\u00043a\u00043e\u000440\u00043e\u000441\u000442\u000438
    this.vx = 0;
    this.vy = 0;
    
    // \u000420\u000430\u000441\u000441\u000442\u00043e\u00044f\u00043d\u000438\u000435 \u000434\u00043e \u000446\u000435\u00043b\u000438
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u00043e\u000431\u00043d\u000430\u000440\u000443\u000436\u000435\u00043d\u000438\u00044f
    if (distance < this.detectionRange) {
      this.isAggressive = true;
    }
    
    if (this.isAggressive) {
      // \u00041f\u000440\u000435\u000441\u00043b\u000435\u000434\u00043e\u000432\u000430\u00043d\u000438\u000435
      if (distance > this.attackRange) {
        const angle = Math.atan2(dy, dx);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
      }
      
      // \u000410\u000442\u000430\u00043a\u000430
      if (distance <= this.attackRange && this.attackCooldown <= 0) {
        this.attack();
        this.attackCooldown = 1;
      }
    } else {
      // \u000421\u00043b\u000443\u000447\u000430\u000439\u00043d\u00043e\u000435 \u000431\u00043b\u000443\u000436\u000434\u000430\u00043d\u000438\u000435
      this.wander(deltaTime);
    }
    
    // \u00041e\u000431\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u00043f\u00043e\u000437\u000438\u000446\u000438\u000438
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    
    // \u00041e\u000431\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u00043a\u000443\u00043b\u000434\u000430\u000443\u00043d\u00043e\u000432
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
    if (this.hitCooldown > 0) {
      this.hitCooldown -= deltaTime;
    }
  }

  /**
   * \u000421\u00043b\u000443\u000447\u000430\u000439\u00043d\u00043e\u000435 \u000431\u00043b\u000443\u000436\u000434\u000430\u00043d\u000438\u000435
   * @param {number} deltaTime - \u000412\u000440\u000435\u00043c\u00044f \u000441 \u00043f\u000440\u00043e\u000448\u00043b\u00043e\u000433\u00043e \u00043a\u000430\u000434\u000440\u000430
   * @private
   */
  wander(deltaTime) {
    this.wanderTimer -= deltaTime;
    
    if (this.wanderTimer <= 0) {
      this.wanderTimer = 1 + Math.random() * 2;
      this.wanderAngle = Math.random() * Math.PI * 2;
    }
    
    this.vx = Math.cos(this.wanderAngle) * this.speed * 0.3;
    this.vy = Math.sin(this.wanderAngle) * this.speed * 0.3;
  }

  /**
   * \u000410\u000442\u000430\u00043a\u000430 \u000446\u000435\u00043b\u000438
   */
  attack() {
    if (this.target && this.target.isAlive) {
      this.target.takeDamage(this.damage);
      this.events.emit('enemy:attack', { enemy: this, damage: this.damage });
    }
  }

  /**
   * \u00041f\u00043e\u00043b\u000443\u000447\u000435\u00043d\u000438\u000435 \u000443\u000440\u00043e\u00043d\u000430
   * @param {number} damage - \u00041a\u00043e\u00043b\u000438\u000447\u000435\u000441\u000442\u000432\u00043e \u000443\u000440\u00043e\u00043d\u000430
   */
  takeDamage(damage) {
    if (!this.isAlive) return;
    
    this.health -= damage;
    this.hitCooldown = 0.2;
    this.isAggressive = true;
    
    this.events.emit('enemy:damaged', { enemy: this, damage });
    
    if (this.health <= 0) {
      this.health = 0;
      this.die();
    }
  }

  /**
   * \u000421\u00043c\u000435\u000440\u000442\u00044c \u000432\u000440\u000430\u000433\u000430
   */
  die() {
    this.isAlive = false;
    this.events.emit('enemy:died', { enemy: this });
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u00043a\u000430 \u000432\u000440\u000430\u000433\u000430
   * @param {CanvasRenderingContext2D} ctx - \u00041a\u00043e\u00043d\u000442\u000435\u00043a\u000441\u000442 canvas
   */
  render(ctx) {
    if (!this.isAlive) return;
    
    let color;
    switch(this.type) {
      case 'skeleton': color = '#ff6b6b'; break;
      case 'zombie': color = '#ff6b6b'; break;
      case 'demon': color = '#ff4757'; break;
      case 'ghost': color = '#ff4757'; break;
      default: color = '#ff6b6b';
    }
    
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}
