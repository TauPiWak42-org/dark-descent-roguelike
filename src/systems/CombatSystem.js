/**
 * Боевая система
 * Управляет атаками игрока и снарядами
 * @class CombatSystem
 */
export class CombatSystem {
  constructor(game, player, enemyManager) {
    this.game = game;
    this.player = player;
    this.enemyManager = enemyManager;
    this.events = game.events;
    
    this.projectiles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    
    this.attackCooldown = 0;
    this.attackRate = 0.3; // Секунд между атаками
    
    this.setupControls();
    this.setupEvents();
  }

  /**
   * Настройка управления
   * @private
   */
  setupControls() {
    this.canvas = this.game.canvas;
    
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
    
    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // Левая кнопка
        this.isAttacking = true;
      }
    });
    
    this.canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.isAttacking = false;
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
   * Атака игрока
   */
  attack() {
    if (this.player.mana < 5 || !this.player.isAlive) return;
    
    this.player.mana -= 5;
    this.events.emit('player:mana', { mana: this.player.mana });
    
    // Направление атаки
    const angle = Math.atan2(
      this.mouseY - this.game.height / 2,
      this.mouseX - this.game.width / 2
    );
    
    // Создание снаряда
    this.projectiles.push({
      x: this.player.x + this.player.width / 2,
      y: this.player.y + this.player.height / 2,
      vx: Math.cos(angle) * 300,
      vy: Math.sin(angle) * 300,
      damage: this.player.damage,
      life: 2,
      radius: 5,
      color: '#ffd700'
    });
  }

  /**
   * Обновление боевой системы
   * @param {number} deltaTime - Время с прошлого кадра
   */
  update(deltaTime) {
    // Обновление кулдауна атаки
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
    
    // Автоатака при удержании
    if (this.isAttacking && this.attackCooldown <= 0) {
      this.attack();
      this.attackCooldown = this.attackRate;
    }
    
    // Обновление снарядов
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      
      projectile.x += projectile.vx * deltaTime;
      projectile.y += projectile.vy * deltaTime;
      projectile.life -= deltaTime;
      
      // Проверка попадания во врагов
      let hit = false;
      for (const enemy of this.enemyManager.enemies) {
        if (!enemy.isAlive) continue;
        
        const dx = enemy.x + enemy.width / 2 - projectile.x;
        const dy = enemy.y + enemy.height / 2 - projectile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < enemy.width / 2 + projectile.radius) {
          enemy.takeDamage(projectile.damage);
          hit = true;
          break;
        }
      }
      
      // Удаление снаряда
      if (hit || projectile.life <= 0) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  /**
   * Отрисовка боевой системы
   * @param {CanvasRenderingContext2D} ctx - Контекст canvas
   */
  render(ctx) {
    // Отрисовка снарядов
    this.projectiles.forEach(projectile => {
      // Основной шар
      ctx.fillStyle = projectile.color;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Свечение
      ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Хвост
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(projectile.x, projectile.y);
      ctx.lineTo(
        projectile.x - projectile.vx * 0.05,
        projectile.y - projectile.vy * 0.05
      );
      ctx.stroke();
    });
  }
}
