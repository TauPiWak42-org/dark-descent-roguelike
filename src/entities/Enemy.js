/**
 * \u000411\u000430\u000437\u00043e\u000432\u00044b\u000439 \u00043a\u00043b\u000430\u000441\u000441 \u000432\u000440\u000430\u000433\u000430
 * \u000426\u000432\u000435\u000442\u000430\u00044f \u00043f\u000430\u00043b\u000438\u000442\u000430\u000432: #1a1a2e, #16213e, #1f1f2e
 * \u000417\u00043e\u00043b\u00043e\u000442\u000430: #d4af37, #ffd700, #8b6914
 * \u000422\u000435\u00043b\u00043e: #2d1b00, #4a3520, #6b4c2a
 * \u00041d\u000435\u00043b\u00043e\u000432\u00044b: \u00043e\u000433\u00043e\u00043d\u00044c #ff6b35, \u00043b\u000451\u000434 #7ec8e3, \u00044f\u000434 #7cb342, \u00043a\u000440\u00043e\u000432\u00044c #8b0000, \u000434\u000443\u000448\u000438 #9b59b6
 * @class Enemy
 */
export class Enemy {
  /**
   * @param {Game} game - \u000411\u000441\u00044b\u00043b\u000430 \u00043d\u000430 \u000438\u000433\u000440\u000443
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
    
    // \u00041e\u000431\u000440\u000430\u000432\u00043a\u000430 \u000447\u000430\u000441\u000442\u000438\u000446\u000430\u000432
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
  }

  /**
   * \u00041f\u00043e\u00043b\u000443\u000447\u000435\u00043d\u000438\u000435 \u000446\u000432\u000435\u000442\u000430 \u000432 \u000437\u000430\u000432\u000438\u000441\u000438\u00043c\u00043e\u000441\u000442\u000438 \u00043e\u000442 \u000442\u000438\u00043f\u000430
   * @returns {string}
   * @private
   */
  getTypeColor() {
    // \u000426\u000432\u000435\u000442\u000430\u00044f \u00043f\u000430\u00043b\u000438\u000442\u000440\u000430: \u00043a\u000440\u000430\u000441\u00043d\u00044b\u000439 #8b0000
    const colors = {
      skeleton: '#e0d5c1',    // \u000411\u000432\u000435\u000442\u00043d\u00044b\u000439 \u000441\u00043a\u000435\u00043b\u000435\u000442
      zombie: '#7cb342',      // \u00041d\u000430 \u00044f\u000434
      demon: '#ff6b35',       // \u00041e\u000433\u00043e\u00043d\u00044c
      ghost: '#9b59b6',      // \u000414\u000443\u000448\u000438
      spider: '#8b0000'      // \u00041a\u000440\u00043e\u000432\u00044c
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
      },
      spider: {
        maxHealth: 25, health: 25, damage: 8, speed: 80,
        attackRange: 30, detectionRange: 180, soulValue: 1, goldValue: 3
      }
    };
    
    const s = stats[this.type] || stats.skeleton;
    Object.assign(this, s);
  }

  /**
   * \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u000441\u00043e\u000431\u00044b\u000442\u000438\u000439
   * @private
   */
  setupEvents() {
    this.unsubscribers = [];
    const unsubscribeUpdate = this.events.on('game:update', (deltaTime) => this.update(deltaTime));
    const unsubscribeRender = this.events.on('game:render', (ctx) => this.render(ctx));
    this.unsubscribers.push(unsubscribeUpdate, unsubscribeRender);
  }

  /**
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
    if (!this.isAlive) return;
    
    // \u000420\u00043e\u000441\u000442\u000430\u000432\u00043b\u000435\u00043d\u000438\u000435 \u000441\u00043a\u00043e\u000440\u00043e\u000441\u000442\u000438
    this.vx = 0;
    this.vy = 0;
    
    // \u000414\u000435\u000441\u000442\u000432\u000440\u000430\u000434 \u000432\u000440\u000430\u000433\u00043d\u000435\u00043d\u000438\u00044e
    if (this.hitCooldown > 0) {
      this.hitCooldown -= deltaTime;
    }
    
    // \u00041e\u000442\u000441\u00043b\u000435\u000434\u000438\u000432\u000430\u000432\u000430 \u000432\u000440\u00043e\u000433\u00043d\u000438\u00043a\u000443\u000442\u000438\u00043a
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
    
    // \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u000430\u000433\u000440\u000435\u000441\u000441\u000438\u000432\u000430\u000441\u000442\u000438
    if (this.target && this.target.isAlive) {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u000430\u000433\u000440\u000435\u000441\u000441\u000438\u000432\u000430\u000441\u000442\u000438\u000430
      if (distance < this.detectionRange) {
        this.isAggressive = true;
        
        // \u00041d\u000430\u00043f\u000430\u000434\u000435\u00043d\u000438\u000435
        if (distance < this.attackRange && this.attackCooldown <= 0) {
          this.attack();
          this.attackCooldown = 1;
        } else {
          // \u00041f\u000440\u000435\u000441\u00043b\u000435\u000434\u00043e\u000432\u000430\u00043d\u000438\u00044e
          this.vx = (dx / distance) * this.speed;
          this.vy = (dy / distance) * this.speed;
        }
      } else {
        // \u000411\u000443\u00043b\u000430\u00043d\u000430\u000442\u00044c \u000432 \u000441\u00043b\u000443\u000447\u000430\u000439\u00043d\u00043e\u00043c \u000440\u000435\u000436\u000438\u00043c
        this.wander(deltaTime);
      }
    } else {
      this.wander(deltaTime);
    }
    
    // \u00041f\u000440\u000438\u00043c\u000435\u00043d\u000438\u000435 \u000434\u000432\u000438\u000436\u000435\u00043d\u000438\u00044f
    const newX = this.x + this.vx * deltaTime;
    const newY = this.y + this.vy * deltaTime;
    
    if (this.game.mapGenerator && this.game.mapGenerator.map) {
      const map = this.game.mapGenerator.map;
      const tileSize = this.game.mapGenerator.tileSize;
      const left = Math.floor(newX / tileSize);
      const right = Math.floor((newX + this.width) / tileSize);
      const top = Math.floor(newY / tileSize);
      const bottom = Math.floor((newY + this.height) / tileSize);
      
      if (this.vx !== 0) {
        const checkX = this.vx > 0 ? right : left;
        const checkY1 = Math.floor(this.y / tileSize);
        const checkY2 = Math.floor((this.y + this.height - 1) / tileSize);
        if (map[checkY1] && map[checkY1][checkX] === 1 || map[checkY2] && map[checkY2][checkX] === 1) {
          this.vx = 0;
        } else {
          this.x = newX;
        }
      }
      if (this.vy !== 0) {
        const checkY = this.vy > 0 ? bottom : top;
        const checkX1 = Math.floor(this.x / tileSize);
        const checkX2 = Math.floor((this.x + this.width - 1) / tileSize);
        if (map[checkY] && (map[checkY][checkX1] === 1 || map[checkY][checkX2] === 1)) {
          this.vy = 0;
        } else {
          this.y = newY;
        }
      }
    } else {
      this.x = newX;
      this.y = newY;
    }
    
    this.x = Math.max(0, Math.min(this.game.worldWidth - this.width, this.x));
    this.y = Math.max(0, Math.min(this.game.worldHeight - this.height, this.y));
  }

  /**
   * \u000411\u000443\u00043b\u000430\u00043d\u000430\u000442\u00044c \u000432 \u000441\u00043b\u000443\u000447\u000430\u000439\u00043d\u00043e\u00043c \u000440\u000435\u000436\u000438\u00043c
   * @param {number} deltaTime
   * @private
   */
  wander(deltaTime) {
    this.wanderTimer -= deltaTime;
    
    if (this.wanderTimer <= 0) {
      this.wanderAngle = Math.random() * Math.PI * 2;
      this.wanderTimer = 1 + Math.random() * 3;
    }
    
    this.vx = Math.cos(this.wanderAngle) * this.speed * 0.5;
    this.vy = Math.sin(this.wanderAngle) * this.speed * 0.5;
    
    this.isAggressive = false;
  }

  /**
   * \u00041d\u000430\u00043d\u000435\u000441\u000435\u00043d\u000438\u000435 \u000430\u000442\u000430\u00043a\u000443
   */
  attack() {
    if (!this.target || !this.target.isAlive) return;
    
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < this.attackRange) {
      this.events.emit('enemy:attack', {
        enemy: this,
        target: this.target,
        damage: this.damage
      });
    }
  }

  /**
   * \u00041f\u00043e\u00043b\u000443\u000447\u000435\u00043d\u000438\u000435 \u000443\u000440\u00043e\u00043d\u000430
   * @param {number} damage
   */
  takeDamage(damage) {
    if (!this.isAlive || this.hitCooldown > 0) return;
    
    this.health -= damage;
    this.hitCooldown = 0.5;
    
    this.events.emit('enemy:damaged', { enemy: this, damage });
    this.events.emit('effect:damage', { x: this.x + this.width/2, y: this.y + this.height/2 });
    
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
    
    // \u00041d\u000430\u000433\u000440\u000430\u000434\u000430\u000434 \u000437\u000430\u00043b\u00043e\u000442\u000430\u000432\u00044b
    if (this.target && this.target.addSouls) {
      this.target.addSouls(this.soulValue);
    }
    if (this.target && this.target.addGold) {
      this.target.addGold(this.goldValue);
    }
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u000432\u000440\u000430\u000433\u000430
   * \u000426\u000432\u000435\u000442: \u000441\u000430\u00043b\u000430\u000442\u000430\u000432 #2d1b00, \u00043e\u000441\u00043d\u00043e\u000432\u00043d\u000430\u00044f #4a3520
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    if (!this.isAlive) return;
    
    ctx.save();
    
    // \u000422\u000435\u00043b\u00043e
    if (this.hitCooldown > 0) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#ff4757';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.globalAlpha = 1;
    }
    
    // \u00041f\u00043e\u000434\u00043b\u00043e\u000441\u000442\u000430\u00044f \u000442\u000435\u00043b\u000430
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, this.darkenColor(this.color, 20));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // \u000417\u00043e\u00043b\u00043e\u000442\u000430\u00044f \u00043e\u00043a\u000430\u00043d\u000442\u00043e\u000432\u00043a\u000430
    ctx.strokeStyle = this.darkenColor(this.color, 40);
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // \u000413\u00043b\u000430\u000437\u000430 \u000432\u000442\u000430\u000432\u00043a\u000438\u00043e\u000432\u000442\u000440\u000438\u000433\u000430\u000432
    this.renderTypeSpecific(ctx);
    
    // \u00041f\u00043e\u00043a\u000430\u000437\u000430\u000442\u000435\u00043b\u00044c \u000437\u000434\u00043e\u000440\u00043e\u000432\u00044c\u00044f
    if (this.isAggressive) {
      ctx.strokeStyle = '#ff4757';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y - 5, this.width / 2 + 5, 0, Math.PI);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u000442\u000438\u00043f\u000443 \u000432 \u000437\u000430\u000432\u000438\u000441\u000438\u00043e\u000441\u000442\u000438 \u00043e\u000442 \u000442\u000438\u00043f\u000430
   * @param {CanvasRenderingContext2D} ctx
   * @private
   */
  renderTypeSpecific(ctx) {
    // \u000421\u000432\u000435\u000446\u00043d\u00044b\u000435 \u000441\u00043a\u000435\u00043b\u000435\u000442\u000430
    if (this.type === 'skeleton') {
      // \u000413\u00043b\u000430\u000437\u000430
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(this.x + 8, this.y + 6, 4, 4);
      ctx.fillRect(this.x + 20, this.y + 6, 4, 4);
      
      // \u000420\u00043e\u000442
      ctx.fillStyle = '#e0d5c1';
      ctx.fillRect(this.x + 12, this.y + 12, 4, 8);
    } else if (this.type === 'zombie') {
      // \u000417\u00043e\u00043b\u00043e\u000442\u000430\u00044b \u000442\u000435\u00043b\u00043e
      ctx.fillStyle = this.darkenColor(this.color, 10);
      ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
    } else if (this.type === 'demon') {
      // \u000420\u00043e\u00043d\u00044c\u00043a\u000438\u000435 \u000443\u000430\u000440\u00043d\u000430\u000442
      ctx.fillStyle = '#8b0000';
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y - 5);
      ctx.lineTo(this.x + 5, this.y + this.height / 2);
      ctx.lineTo(this.x + this.width - 5, this.y + this.height / 2);
      ctx.closePath();
      ctx.fill();
    } else if (this.type === 'ghost') {
      // \u00041f\u000440\u00043e\u000437\u000440\u000430\u000447\u00043d\u00043e\u000441\u000442\u00044c
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    } else if (this.type === 'spider') {
      // \u00041f\u000430\u000443\u00043a\u000438\u00043d\u000430\u000432\u00043e\u000433\u000438\u000435 \u00043d\u00043e\u000436\u00043a\u000438
      ctx.fillStyle = this.darkenColor(this.color, 30);
      ctx.beginPath();
      ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // \u00041d\u00043e\u000436\u00043a\u000438
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const legX = this.x + this.width / 2 + Math.cos(angle) * this.width / 2;
        const legY = this.y + this.height / 2 + Math.sin(angle) * this.height / 2;
        ctx.fillRect(legX - 2, legY - 2, 4, 8);
      }
    }
  }

  /**
   * \u00041e\u000442\u000435\u00043d\u000438\u000442\u00044c \u000446\u000432\u000435\u000442
   * @param {string} color
   * @param {number} percent
   * @returns {string}
   * @private
   */
  darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return `#${(
      0x1000000 +
      (R < 0 ? 0 : R) * 0x10000 +
      (G < 0 ? 0 : G) * 0x100 +
      (B < 0 ? 0 : B)
    ).toString(16).slice(1)}`;
  }
}
