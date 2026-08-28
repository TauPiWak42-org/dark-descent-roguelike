/**
 * Base enemy class
 * @class Enemy
 */
export class Enemy {
  constructor(game, x, y, type = 'skeleton') {
    this.game = game;
    this.events = game.events;

    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;

    this.width = 28;
    this.height = 28;

    this.type = type;
    this.setupStats();

    this.isAlive = true;
    this.isAggressive = false;
    this.attackCooldown = 0;
    this.hitCooldown = 0;
    this.wanderTimer = 0;
    this.wanderAngle = Math.random() * Math.PI * 2;

    this.target = null;
    this.color = this.getTypeColor();
    this.unsubscribers = [];
    this.setupEvents();
  }

  cleanup() {
    for (const unsubscribe of this.unsubscribers) {
      unsubscribe();
    }
    this.unsubscribers = [];
  }

  getTypeColor() {
    const colors = {
      skeleton: '#e0d5c1',
      zombie: '#7cb342',
      demon: '#ff6b35',
      ghost: '#9b59b6',
      spider: '#8b0000'
    };
    return colors[this.type] || '#ff6b6b';
  }

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

  setupEvents() {
    const unsubscribeUpdate = this.events.on('game:update', (deltaTime) => this.update(deltaTime));
    const unsubscribeRender = this.events.on('game:render', (ctx) => this.render(ctx));
    this.unsubscribers.push(unsubscribeUpdate, unsubscribeRender);
  }

  setTarget(player) {
    this.target = player;
  }

  update(deltaTime) {
    if (!this.isAlive) return;

    this.vx = 0;
    this.vy = 0;

    if (this.hitCooldown > 0) {
      this.hitCooldown -= deltaTime;
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }

    if (this.target && this.target.isAlive) {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.detectionRange) {
        this.isAggressive = true;

        if (distance < this.attackRange && this.attackCooldown <= 0) {
          this.attack();
          this.attackCooldown = 1;
        } else {
          this.vx = (dx / distance) * this.speed;
          this.vy = (dy / distance) * this.speed;
        }
      } else {
        this.wander(deltaTime);
      }
    } else {
      this.wander(deltaTime);
    }

    const newX = this.x + this.vx * deltaTime;
    const newY = this.y + this.vy * deltaTime;

    if (this.game.mapGenerator && this.game.mapGenerator.map) {
      const map = this.game.mapGenerator.map;
      const tileSize = this.game.mapGenerator.tileSize;
      
      if (this.vx !== 0) {
        const checkX = this.vx > 0 ? Math.floor((newX + this.width) / tileSize) : Math.floor(newX / tileSize);
        const checkY1 = Math.floor(this.y / tileSize);
        const checkY2 = Math.floor((this.y + this.height - 1) / tileSize);
        if ((map[checkY1] && map[checkY1][checkX] === 1) || (map[checkY2] && map[checkY2][checkX] === 1)) {
          this.vx = 0;
        } else {
          this.x = newX;
        }
      }
      
      if (this.vy !== 0) {
        const checkY = this.vy > 0 ? Math.floor((newY + this.height) / tileSize) : Math.floor(newY / tileSize);
        const checkX1 = Math.floor(this.x / tileSize);
        const checkX2 = Math.floor((this.x + this.width - 1) / tileSize);
        if ((map[checkY] && map[checkY][checkX1] === 1) || (map[checkY] && map[checkY][checkX2] === 1)) {
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

  die() {
    this.isAlive = false;
    this.events.emit('enemy:died', { enemy: this });

    if (this.target && this.target.addSouls) {
      this.target.addSouls(this.soulValue);
    }
    if (this.target && this.target.addGold) {
      this.target.addGold(this.goldValue);
    }
  }

  darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max((num >> 16) - amt, 0);
    const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
    const B = Math.max((num & 0x0000FF) - amt, 0);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  }

  renderTypeSpecific(ctx) {
    ctx.fillStyle = '#ffffff';
    const eyeSize = 4;
    ctx.fillRect(this.x + 6, this.y + 6, eyeSize, eyeSize);
    ctx.fillRect(this.x + this.width - 10, this.y + 6, eyeSize, eyeSize);
  }

  render(ctx) {
    if (!this.isAlive) return;

    ctx.save();

    if (this.hitCooldown > 0) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#ff4757';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.globalAlpha = 1;
    }

    const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, this.darkenColor(this.color, 20));

    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.strokeStyle = this.darkenColor(this.color, 40);
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    this.renderTypeSpecific(ctx);

    if (this.isAggressive) {
      const healthPercent = this.health / this.maxHealth;
      const barWidth = this.width;
      const barHeight = 4;
      const barX = this.x;
      const barY = this.y + this.height + 3;

      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(barX, barY, barWidth, barHeight);

      ctx.fillStyle = '#ff4757';
      ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

      ctx.strokeStyle = '#8b0000';
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    ctx.restore();
  }
}
