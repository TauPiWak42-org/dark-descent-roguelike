/**
 * Система частиц
 * Создаёт визуальные эффекты: взрывы, искры, дым
 * @class ParticleSystem
 */
export class ParticleSystem {
  constructor(game) {
    this.game = game;
    this.events = game.events;
    
    this.particles = [];
    this.maxParticles = 1000;
    
    this.setupEvents();
  }

  /**
   * Настройка событий
   * @private
   */
  setupEvents() {
    this.events.on('game:update', (deltaTime) => this.update(deltaTime));
    this.events.on('game:render', (ctx) => this.render(ctx));
    this.events.on('enemy:died', (data) => this.onEnemyDied(data));
    this.events.on('player:damaged', (data) => this.onPlayerDamaged(data));
  }

  /**
   * Создание частицы
   * @param {Object} options - Параметры частицы
   */
  spawnParticle(options) {
    if (this.particles.length >= this.maxParticles) return;
    
    this.particles.push({
      x: options.x || 0,
      y: options.y || 0,
      vx: options.vx || (Math.random() - 0.5) * 100,
      vy: options.vy || (Math.random() - 0.5) * 100,
      life: options.life || 1,
      maxLife: options.life || 1,
      size: options.size || 3,
      color: options.color || '#ffd700',
      gravity: options.gravity || 0,
      fade: options.fade !== false,
      type: options.type || 'square' // square, circle
    });
  }

  /**
   * Создание взрыва частиц
   * @param {number} x - Позиция X
   * @param {number} y - Позиция Y
   * @param {number} count - Количество частиц
   * @param {string} color - Цвет частиц
   */
  explode(x, y, count = 20, color = '#ffd700') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 150;
      
      this.spawnParticle({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.5 + Math.random() * 0.5,
        size: 2 + Math.random() * 3,
        color: color,
        gravity: 200,
        fade: true,
        type: Math.random() < 0.5 ? 'circle' : 'square'
      });
    }
  }

  /**
   * Обработка смерти врага
   * @param {Object} data - Данные о смерти
   * @private
   */
  onEnemyDied(data) {
    const { enemy } = data;
    const centerX = enemy.x + enemy.width / 2;
    const centerY = enemy.y + enemy.height / 2;
    
    // Взрыв душ
    this.explode(centerX, centerY, 30, '#9b59b6');
    
    // Золотые частицы
    this.explode(centerX, centerY, 10, '#d4af37');
  }

  /**
   * Обработка урона игрока
   * @param {Object} data - Данные об уроне
   * @private
   */
  onPlayerDamaged(data) {
    if (this.game.player) {
      this.explode(
        this.game.player.x + this.game.player.width / 2,
        this.game.player.y + this.game.player.height / 2,
        15,
        '#ff0000'
      );
    }
  }

  /**
   * Обновление частиц
   * @param {number} deltaTime - Время с прошлого кадра
   */
  update(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Обновление позиции
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      
      // Гравитация
      if (particle.gravity) {
        particle.vy += particle.gravity * deltaTime;
      }
      
      // Затухание скорости
      particle.vx *= 0.98;
      particle.vy *= 0.98;
      
      // Уменьшение жизни
      particle.life -= deltaTime;
      
      // Удаление мёртвых частиц
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Отрисовка частиц
   * @param {CanvasRenderingContext2D} ctx - Контекст canvas
   */
  render(ctx) {
    this.particles.forEach(particle => {
      // Прозрачность на основе оставшейся жизни
      const alpha = particle.fade 
        ? particle.life / particle.maxLife 
        : 1;
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      
      // Отрисовка в зависимости от типа
      if (particle.type === 'circle') {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(
          particle.x - particle.size / 2,
          particle.y - particle.size / 2,
          particle.size,
          particle.size
        );
      }
    });
    
    // Сброс прозрачности
    ctx.globalAlpha = 1;
  }
}
