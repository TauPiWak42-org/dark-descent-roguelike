/**
 * Класс игрока
 * TOPDOWN game - movement is relative to world
 * @class Player
 */
export class Player {
  constructor(game) {
    this.game = game;
    this.events = game.events;
    this.x = 400;
    this.y = 300;
    this.vx = 0;
    this.vy = 0;
    this.width = 32;
    this.height = 32;
    this.maxHealth = 100;
    this.health = 100;
    this.maxMana = 50;
    this.mana = 50;
    this.speed = 200;
    this.damage = 15;
    this.isMoving = false;
    this.facing = 'right';
    this.invulnerable = false;
    this.invulnerableTimer = 0;
    this.isAlive = true;
    this.gold = 0;
    this.souls = 0;
    this.floor = 1;
    this.xp = 0;
    this.manaRegenRate = 10;
    this.manaRegenTimer = 0;
    this.manaRegenInterval = 0.1;
    this.unsubscribers = [];
    this.clickTargetX = null;
    this.clickTargetY = null;
    this.setupEvents();
  }

  cleanup() {
    for (const unsubscribe of this.unsubscribers) unsubscribe();
    this.unsubscribers = [];
  }

  setupEvents() {
    const unsubscribeUpdate = this.events.on('game:update', (deltaTime) => this.update(deltaTime));
    const unsubscribeRender = this.events.on('game:render', (ctx) => this.render(ctx));
    this.unsubscribers.push(unsubscribeUpdate, unsubscribeRender);
  }

  update(deltaTime) {
    if (!this.isAlive) return;
    
    // Регенерация маны
    this.manaRegenTimer += deltaTime;
    if (this.manaRegenTimer >= this.manaRegenInterval && this.mana < this.maxMana) {
      this.mana = Math.min(this.maxMana, this.mana + this.manaRegenRate * this.manaRegenInterval);
      this.manaRegenTimer = 0;
      this.events.emit('player:mana', { mana: this.mana });
    }
    
    // Таймер неуязвимости
    if (this.invulnerable) {
      this.invulnerableTimer -= deltaTime;
      if (this.invulnerableTimer <= 0) this.invulnerable = false;
    }
    
    // Движение к точке клика
    if (this.clickTargetX !== null && this.clickTargetY !== null) {
      const targetWorldX = this.clickTargetX + this.game.camera.x;
      const targetWorldY = this.clickTargetY + this.game.camera.y;
      const dx = targetWorldX - (this.x + this.width/2);
      const dy = targetWorldY - (this.y + this.height/2);
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist > 5) {
        this.vx = (dx / dist) * this.speed;
        this.vy = (dy / dist) * this.speed;
        if (Math.abs(dx) > Math.abs(dy)) {
          this.facing = dx > 0 ? 'right' : 'left';
        }
      } else {
        this.clickTargetX = null;
        this.clickTargetY = null;
        this.vx = 0;
        this.vy = 0;
      }
    } else {
      // Клавиатурное управление (WASD + ЦФЫВ)
      this.vx = 0;
      this.vy = 0;
      if (this.game.input) {
        if (this.game.input.isKeyDown('w') || this.game.input.isKeyDown('ц')) this.vy = -this.speed;
        if (this.game.input.isKeyDown('s') || this.game.input.isKeyDown('ы')) this.vy = this.speed;
        if (this.game.input.isKeyDown('a') || this.game.input.isKeyDown('ф')) {
          this.vx = -this.speed;
          this.facing = 'left';
        }
        if (this.game.input.isKeyDown('d') || this.game.input.isKeyDown('т')) {
          this.vx = this.speed;
          this.facing = 'right';
        }
      }
    }
    
    // Нормализация диагонального движения
    if (this.vx !== 0 && this.vy !== 0) {
      this.vx *= Math.SQRT1_2;
      this.vy *= Math.SQRT1_2;
    }
    
    // Обновление позиции
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    
    // Ограничение миром
    this.x = Math.max(0, Math.min(this.game.worldWidth - this.width, this.x));
    this.y = Math.max(0, Math.min(this.game.worldHeight - this.height, this.y));
    
    this.isMoving = this.vx !== 0 || this.vy !== 0;
  }

  render(ctx) {
    if (!this.isAlive) return;
    
    // Мигание при неуязвимости
    if (this.invulnerable && Math.floor(this.invulnerableTimer * 10) % 2 === 0) return;
    
    ctx.save();
    
    // Тень
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(this.x, this.y + this.height - 4, this.width, 4);
    
    // Тело с градиентом
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, '#4a3520');
    gradient.addColorStop(0.5, '#6b4c2a');
    gradient.addColorStop(1, '#2d1b00');
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Золотая окантовка
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Глаза
    ctx.fillStyle = '#ffd700';
    const eyeY = this.y + 10;
    const eyeOffset = this.facing === 'right' ? 22 : 4;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 5;
    ctx.fillRect(this.x + eyeOffset, eyeY, 6, 6);
    ctx.fillRect(this.x + eyeOffset, eyeY + 12, 6, 6);
    ctx.shadowBlur = 0;
    
    // Стрелка направления выстрела (всегда рисуем)
    this.renderArrow(ctx);
    
    ctx.restore();
  }
  
  renderArrow(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const arrowLength = 25;
    
    // Определяем направление по углу мыши относительно игрока (в мировых координатах)
    let arrowAngle = 0;
    if (this.game.combatSystem) {
      const mouseX = this.game.combatSystem.mouseX;
      const mouseY = this.game.combatSystem.mouseY;
      // Курсор в мировых координатах
      const worldMouseX = mouseX + this.game.camera.x;
      const worldMouseY = mouseY + this.game.camera.y;
      // Угол от игрока к курсору
      arrowAngle = Math.atan2(worldMouseY - centerY, worldMouseX - centerX);
    } else {
      arrowAngle = this.facing === 'right' ? 0 : Math.PI;
    }
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(arrowAngle);
    
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(arrowLength, 0);
    ctx.lineTo(arrowLength - 6, -5);
    ctx.moveTo(arrowLength, 0);
    ctx.lineTo(arrowLength - 6, 5);
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    ctx.restore();
  }

  setClickTarget(worldX, worldY) {
    this.clickTargetX = worldX;
    this.clickTargetY = worldY;
  }

  takeDamage(damage) {
    if (this.invulnerable || !this.isAlive) return;
    this.health -= damage;
    this.invulnerable = true;
    this.invulnerableTimer = 1;
    this.events.emit('player:damaged', { damage, health: this.health });
    this.events.emit('effect:damage', { x: this.x + this.width/2, y: this.y + this.height/2 });
    if (this.health <= 0) {
      this.health = 0;
      this.die();
    }
  }

  heal(amount) {
    if (!this.isAlive) return;
    const oldHealth = this.health;
    this.health = Math.min(this.maxHealth, this.health + amount);
    const healedAmount = this.health - oldHealth;
    if (healedAmount > 0) {
      this.events.emit('player:healed', { amount: healedAmount, health: this.health });
      this.events.emit('effect:heal', { x: this.x + this.width/2, y: this.y + this.height/2 });
    }
  }

  restoreMana(amount) {
    if (!this.isAlive) return;
    this.mana = Math.min(this.maxMana, this.mana + amount);
    this.events.emit('player:mana', { amount, mana: this.mana });
  }

  addGold(amount) {
    this.gold += amount;
    this.events.emit('player:gold', { amount, gold: this.gold });
    this.events.emit('effect:gold', { x: this.x + this.width/2, y: this.y + this.height/2, amount });
  }

  addSouls(amount) {
    this.souls += amount;
    this.events.emit('player:souls', { amount, souls: this.souls });
    this.events.emit('effect:soul', { x: this.x + this.width/2, y: this.y + this.height/2, amount });
  }

  die() {
    this.isAlive = false;
    this.events.emit('player:died');
    this.game.gameOver();
  }
}
