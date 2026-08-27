/**
 * \u000411\u00043e\u000435\u000432\u000430\u00044f \u000441\u000438\u000441\u000442\u000435\u00043c\u000430
 * \u000423\u00043f\u000440\u000430\u000432\u00043b\u00044f\u000435\u000442 \u000430\u000442\u000430\u00043a\u000430 \u000438\u000433\u000440\u00043e\u00043a\u000430 \u000438 \u000441\u00043d\u000430\u000440\u00044f\u000434\u000430\u00043c\u000438
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
    this.attackRate = 0.3; // \u000421\u000435\u00043a\u000443\u00043d\u000434\u000430 \u00043c\u000435\u000436\u000434\u000443 \u000430\u000442\u000430\u00043a\u000430\u00043c\u000438
    
    this.setupControls();
    this.setupEvents();
  }

  /**
   * \u00041e\u000447\u000438\u000441\u000442\u00043a\u000430 \u000440\u000435\u000441\u000443\u000440\u000441\u00043e\u000432
   */
  cleanup() {
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mousedown', this.handleMouseDown);
      this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    }
  }

  /**
   * \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u000443\u00043f\u000440\u000430\u000432\u00043b\u000435\u00043d\u000438\u00044f
   * @private
   */
  setupControls() {
    this.canvas = this.game.canvas;
    
    this.handleMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    };
    
    this.handleMouseDown = (e) => {
      if (e.button === 0) { // \u00041b\u000435\u000432\u000430\u00044f \u00043a\u00043d\u00043e\u00043f\u00043a\u000430
        this.isAttacking = true;
      }
    };
    
    this.handleMouseUp = (e) => {
      if (e.button === 0) {
        this.isAttacking = false;
      }
    };
    
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
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
   * \u000410\u000442\u000430\u00043a\u000430 \u000438\u000433\u000440\u00043e\u00043a\u000430
   */
  attack() {
    if (this.player.mana < 5 || !this.player.isAlive) return;
    
    this.player.mana -= 5;
    this.events.emit('player:mana', { mana: this.player.mana });
    
    // \u00041d\u000430\u00043f\u000440\u000430\u000432\u00043b\u000435\u00043d\u000438\u000435 \u000430\u000442\u000430\u00043a\u000430\u00043c\u000438
    const angle = Math.atan2(
      this.mouseY - this.game.height / 2,
      this.mouseX - this.game.width / 2
    );
    
    // \u000421\u00043e\u000437\u000434\u000430\u00043d\u000438\u000435 \u000441\u00043d\u000430\u000440\u00044f\u000434\u000430
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
   * \u00041e\u000431\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u000431\u00043e\u000435\u000432\u00043e\u000439 \u000441\u000438\u000441\u000442\u000435\u00043c\u00044b
   * @param {number} deltaTime - \u000412\u000440\u000435\u00043c\u00044f \u000441 \u00043f\u000440\u00043e\u000448\u00043b\u00043e\u000433\u00043e \u00043a\u000430\u000434\u000440\u000430
   */
  update(deltaTime) {
    // \u00041e\u000431\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u00043a\u000443\u00043b\u000434\u000430\u000443\u000430 \u000430\u000442\u000430\u00043a\u000430\u000432
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
    
    // \u000410\u000432\u000442\u00043e\u000430\u000442\u000430\u00043a\u000430 \u00043f\u000440\u000438 \u000443\u000434\u000435\u000440\u000436\u000430\u000432\u000430\u00044b\u000438\u000438
    if (this.isAttacking && this.attackCooldown <= 0) {
      this.attack();
      this.attackCooldown = this.attackRate;
    }
    
    // \u00041e\u000431\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u000441\u00043d\u000430\u000440\u00044f\u000434\u00043e\u000432
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      
      projectile.x += projectile.vx * deltaTime;
      projectile.y += projectile.vy * deltaTime;
      projectile.life -= deltaTime;
      
      // \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u00043f\u00043e\u00043f\u000430\u000434\u000430\u00043d\u000438\u00044f \u000432\u00043e \u000432\u000440\u000430\u000433\u000430\u000432
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
      
      // \u000423\u000434\u000430\u00043b\u000435\u00043d\u000438\u000435 \u000441\u00043d\u000430\u000440\u00044f\u000434\u000430
      if (hit || projectile.life <= 0) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u00043a\u000430 \u000431\u00043e\u000435\u000432\u00043e\u000439 \u000441\u000438\u000441\u000442\u000435\u00043c\u00044b
   * @param {CanvasRenderingContext2D} ctx - \u00041a\u00043e\u00043d\u000442\u000435\u00043a\u000441\u000442 canvas
   */
  render(ctx) {
    // \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u00043a\u000430 \u000441\u00043d\u000430\u000440\u00044f\u000434\u00043e\u000432
    this.projectiles.forEach(projectile => {
      // \u00041e\u000441\u00043d\u00043e\u000432\u00043d\u00043e\u000439 \u000448\u000430\u000440
      ctx.fillStyle = projectile.color;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // \u000421\u000432\u000435\u000447\u000435\u00043d\u000438\u000435
      ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // \u000425\u000432\u00043e\u000441\u000442
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
