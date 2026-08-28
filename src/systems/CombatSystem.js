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
    this.attackRate = 0.3;
    this.setupControls();
    this.setupEvents();
  }

  cleanup() {
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mousedown', this.handleMouseDown);
      this.canvas.removeEventListener('mouseup', this.handleMouseUp);
      this.canvas.removeEventListener('contextmenu', this.handleContextMenu);
    }
  }

  setupControls() {
    this.canvas = this.game.canvas;
    
    this.handleMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    };
    
    this.handleMouseDown = (e) => {
      if (e.button === 0) {
        this.isAttacking = true;
      }
    };
    
    this.handleMouseUp = (e) => {
      if (e.button === 0) {
        this.isAttacking = false;
      }
    };
    
    // ПКМ для движения
    this.handleContextMenu = (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      // Сохраняем координаты клика в мировых координатах
      const worldX = clickX + this.game.camera.x;
      const worldY = clickY + this.game.camera.y;
      this.player.setClickTarget(worldX, worldY);
    };
    
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.canvas.addEventListener('contextmenu', this.handleContextMenu);
  }

  setupEvents() {
    this.unsubscribers = [];
    const unsubscribeUpdate = this.events.on('game:update', (deltaTime) => this.update(deltaTime));
    const unsubscribeRender = this.events.on('game:render', (ctx) => this.render(ctx));
    this.unsubscribers.push(unsubscribeUpdate, unsubscribeRender);
    
    // Обработка атаки врага на игрока
    const unsubscribeEnemyAttack = this.events.on('enemy:attack', (data) => {
      if (data.target === this.player) {
        this.player.takeDamage(data.damage);
      }
    });
    this.unsubscribers.push(unsubscribeEnemyAttack);
  }

  attack() {
    if (this.player.mana < 5 || !this.player.isAlive) return;
    
    this.player.mana -= 5;
    this.events.emit('player:mana', { mana: this.player.mana });
    
    // Направление атаки по мышке относительно центра экрана
    const angle = Math.atan2(
      this.mouseY - this.game.height / 2,
      this.mouseX - this.game.width / 2
    );
    
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

  update(deltaTime) {
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
    
    if (this.isAttacking && this.attackCooldown <= 0) {
      this.attack();
      this.attackCooldown = this.attackRate;
    }
    
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.x += projectile.vx * deltaTime;
      projectile.y += projectile.vy * deltaTime;
      projectile.life -= deltaTime;
      
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
      
      if (hit || projectile.life <= 0) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  render(ctx) {
    this.projectiles.forEach(projectile => {
      ctx.fillStyle = projectile.color;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius * 2, 0, Math.PI * 2);
      ctx.fill();
      
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
