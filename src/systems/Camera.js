/**
 * Система камеры
 * Отвечает за следование за целью и трансформации отрисовки
 * @class Camera
 */
export class Camera {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
    
    // Тряска камеры
    this.shakeAmount = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
    
    // Плавное следование
    this.smoothness = 0.1;
    this.targetX = 0;
    this.targetY = 0;
  }

  /**
   * Следование за целью
   * @param {Object} target - Цель (обычно игрок)
   */
  follow(target) {
    this.targetX = target.x - this.game.width / 2 + target.width / 2;
    this.targetY = target.y - this.game.height / 2 + target.height / 2;
    
    // Плавное следование
    this.x += (this.targetX - this.x) * this.smoothness;
    this.y += (this.targetY - this.y) * this.smoothness;
    
    // Добавление тряски
    if (this.shakeTimer > 0) {
      this.shakeTimer -= 1/60;
      const shakeX = (Math.random() - 0.5) * this.shakeAmount;
      const shakeY = (Math.random() - 0.5) * this.shakeAmount;
      this.x += shakeX;
      this.y += shakeY;
    }
  }

  /**
   * Вызов тряски камеры
   * @param {number} amount - Сила тряски в пикселях
   * @param {number} duration - Длительность в секундах
   */
  shake(amount, duration) {
    this.shakeAmount = amount;
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  }

  /**
   * Применение трансформации камеры к контексту
   * @param {CanvasRenderingContext2D} ctx - Контекст canvas
   */
  applyTransform(ctx) {
    ctx.save();
    ctx.translate(-this.x, -this.y);
    ctx.scale(this.zoom, this.zoom);
  }

  /**
   * Сброс трансформации камеры
   * @param {CanvasRenderingContext2D} ctx - Контекст canvas
   */
  resetTransform(ctx) {
    ctx.restore();
  }
}
