/**
 * Класс игрока
 * Управляет движением, здоровьем и ресурсами игрока
 * @class Player
 */
export class Player {
  constructor(game) {
    this.game = game;
    this.events = game.events;
    
    // Позиция
    this.x = 400;
    this.y = 300;
    this.vx = 0;
    this.vy = 0;
    
    // Размеры
    this.width = 32;
    this.height = 32;
    
    // Характеристики
    this.maxHealth = 100;
    this.health = 100;
    this.maxMana = 50;
    this.mana = 50;
    this.speed = 200;
    this.damage = 15;
    
    // Состояние
    this.isMoving = false;
    this.facing = 'right';
    this.invulnerable = false;
    this.invulnerableTimer = 0;
    this.isAlive = true;
    
    // Ресурсы
    this.gold = 0;
    this.souls = 0;
    this.floor = 1;
    
    this.setupControls();
    this.setupEvents();
  }

  /**
   * Настройка управления
   * @private
   */
  setupControls() {
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false
    };
    
    window.addEventListener('keydown', (e) => {
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'ц':
          this.keys.up = true;
          break;
        case 's':
        case 'ы':
          this.keys.down = true;
          break;
        case 'a':
        case 'ф':
          this.keys.left = true;
          break;
        case 'd':
        case 'в':
          this.keys.right = true;
          break;
      }
    });
    
    window.addEventListener('keyup', (e) => {
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'ц':
          this.keys.up = false;
          break;
        case 's':
        case 'ы':
          this.keys.down = false;
          break;
        case 'a':
        case 'ф':
          this.keys.left = false;
          break;
        case 'd':
        case 'в':
          this.keys.right = false;
          break;
      }
    });
  }

  /**
   * Настройка событий
   * @private
   */
  setupEvents() {
    this.events.on('game:update', (deltaTime) => this.update(deltaTime));
    this.events.on('game:render', (ctx) => this.render(ctx));
  }

  /**
   * Обновление состояния игрока
   * @param {number} deltaTime - Время с прошлого кадра в секундах
   */
  update(deltaTime) {
    if (!this.isAlive) return;
    
    // Сброс скорости
    this.vx = 0;
    this.vy = 0;
    
    // Обработка ввода
    if (this.keys.up) this.vy = -this.speed;
    if (this.keys.down) this.vy = this.speed;
    if (this.keys.left) {
      this.vx = -this.speed;
      this.facing = 'left';
    }
    if (this.keys.right) {
      this.vx = this.speed;
      this.facing = 'right';
    }
    
    // Нормализация диагонального движения
    if (this.vx !== 0 && this.vy !== 0) {
      this.vx *= Math.SQRT1_2;
      this.vy *= Math.SQRT1_2;
    }
    
    // Обновление позиции
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    
    // Ограничение по экрану
    this.x = Math.max(0, Math.min(this.game.width - this.width, this.x));
    this.y = Math.max(0, Math.min(this.game.height - this.height, this.y));
    
    // Проверка движения
    this.isMoving = this.vx !== 0 || this.vy !== 0;
    
    // Таймер неуязвимости
    if (this.invulnerable) {
      this.invulnerableTimer -= deltaTime;
      if (this.invulnerableTimer <= 0) {
        this.invulnerable = false;
      }
    }
  }

  /**
   * Отрисовка игрока
   * @param {CanvasRenderingContext2D} ctx - Контекст canvas
   */
  render(ctx) {
    if (!this.isAlive) return;
    
    // Мигание при неуязвимости
    if (this.invulnerable && Math.floor(this.invulnerableTimer * 10) % 2 === 0) {
      return;
    }
    
    ctx.save();
    
    // Тень
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(this.x, this.y + this.height - 4, this.width, 4);
    
    // Тело с градиентом
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, '#4a3520');
    gradient.addColorStop(0.5, '#6b4c2a');
    gradient.addColorStop(1, '#3d2b1a');
    
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
    
    ctx.fillRect(this.x + eyeOffset, eyeY, 6, 6);
    ctx.fillRect(this.x + eyeOffset, eyeY + 12, 6, 6);
    
    // Свечение глаз
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 5;
    ctx.fillRect(this.x + eyeOffset, eyeY, 6, 6);
    ctx.fillRect(this.x + eyeOffset, eyeY + 12, 6, 6);
    ctx.shadowBlur = 0;
    
    ctx.restore();
  }

  /**
   * Получение урона
   * @param {number} damage - Количество урона
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
   * Лечение игрока
   * @param {number} amount - Количество здоровья
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
   * Восстановление маны
   * @param {number} amount - Количество маны
   */
  restoreMana(amount) {
    if (!this.isAlive) return;
    
    this.mana = Math.min(this.maxMana, this.mana + amount);
    this.events.emit('player:mana', { amount, mana: this.mana });
  }

  /**
   * Добавление золота
   * @param {number} amount - Количество золота
   */
  addGold(amount) {
    this.gold += amount;
    this.events.emit('player:gold', { amount, gold: this.gold });
  }

  /**
   * Добавление душ
   * @param {number} amount - Количество душ
   */
  addSouls(amount) {
    this.souls += amount;
    this.events.emit('player:souls', { amount, souls: this.souls });
  }

  /**
   * Смерть игрока
   */
  die() {
    this.isAlive = false;
    this.events.emit('player:died');
    this.game.gameOver();
  }
}
