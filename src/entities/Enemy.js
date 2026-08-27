/**
 * Базовый класс врага
 * @class Enemy
 */
export class Enemy {
  /**
   * @param {Game} game - Ссылка на игру
   * @param {number} x - Позиция X
   * @param {number} y - Позиция Y
   * @param {string} type - Тип врага
   */
  constructor(game, x, y, type = 'skeleton') {
    this.game = game;
    this.events = game.events;
    
    // Позиция
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    
    // Размеры
    this.width = 28;
    this.height = 28;
    
    // Тип и характеристики
    this.type = type;
    this.setupStats();
    
    // Состояние
    this.isAlive = true;
    this.isAggressive = false;
    this.attackCooldown = 0;
    this.hitCooldown = 0;
    this.wanderTimer = 0;
    this.wanderAngle = Math.random() * Math.PI * 2;
    
    // Цель
    this.target = null;
  }

  /**
   * Настройка характеристик в зависимости от типа
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
   * Установка цели для преследования
   * @param {Player} player - Игрок
   */
  setTarget(player) {
    this.target = player;
  }

  /**
   * Обновление состояния врага
   * @param {number} deltaTime - Время с прошлого кадра
   */
  update(deltaTime) {
    if (!this.isAlive || !this.target) return;
    
    // Сброс скорости
    this.vx = 0;
    this.vy = 0;
    
    // Расстояние до цели
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Проверка обнаружения
    if (distance < this.detectionRange) {
      this.isAggressive = true;
    }
    
    if (this.isAggressive) {
      // Преследование
      if (distance > this.attackRange) {
        const angle = Math.atan2(dy, dx);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
      }
      
      // Атака
      if (distance <= this.attackRange && this.attackCooldown <= 0) {
        this.attack();
        this.attackCooldown = 1;
      }
    } else {
      // Случайное блуждание
      this.wander(deltaTime);
    }
    
    // Обновление позиции
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    
    // Обновление кулдаунов
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
    if (this.hitCooldown > 0) {
      this.hitCooldown -= deltaTime;
    }
  }

  /**
   * Случайное блуждание
   * @param {number} deltaTime - Время с прошлого кадра
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
   * Атака цели
   */
  attack() {
    if (this.target && this.target.isAlive) {
      this.target.takeDamage(this.damage);
      this.events.emit('enemy:attack', { enemy: this, damage: this.damage });
    }
  }

  /**
   * Получение урона
   * @param {number} damage - Количество урона
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
   * Смерть врага
   */
  die() {
    this.isAlive = false;
    this.events.emit('enemy:died', { enemy: this });
  }

  /**
   * Отрисовка врага
   * @param {CanvasRenderingContext2D} ctx - Контекст canvas
   */
  render(ctx) {
    if (!this.isAlive) return;
    
    ctx.save();
    
    // Мигание при получении урона
    if (this.hitCooldown > 0 && Math.floor(this.hitCooldown * 10) % 2 === 0) {
      ctx.fillStyle = '#ffffff';
    } else {
      // Цвет в зависимости от типа
      const colors = {
        skeleton: '#d0d0d0',
        zombie: '#556b2f',
        demon: '#8b0000',
        ghost: 'rgba(155, 89, 182, 0.7)'
      };
      ctx.fillStyle = colors[this.type] || '#d0d0d0';
    }
    
    // Тело
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Золотая окантовка для агрессивных
    if (this.isAggressive) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    
    // Глаза
    ctx.fillStyle = '#ff0000';
    const eyeY = this.y + 8;
    const eyeOffset = this.target && this.target.x < this.x ? 4 : 18;
    
    ctx.fillRect(this.x + eyeOffset, eyeY, 5, 5);
    ctx.fillRect(this.x + eyeOffset, eyeY + 10, 5, 5);
    
    // Свечение глаз для агрессивных
    if (this.isAggressive) {
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = 5;
      ctx.fillRect(this.x + eyeOffset, eyeY, 5, 5);
      ctx.fillRect(this.x + eyeOffset, eyeY + 10, 5, 5);
      ctx.shadowBlur = 0;
    }
    
    ctx.restore();
  }
}
