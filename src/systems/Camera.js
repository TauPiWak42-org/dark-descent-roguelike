/**
 * Система камеры
 * Отвечает за следования за целью и трансформации отражения
 * TOPDOWN game - camera follows player in world coordinates
 * @class Camera
 */
export class Camera {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
    this.shakeAmount = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
    this.smoothness = 0.15;
    this.targetX = 0;
    this.targetY = 0;
  }

  follow(target) {
    if (!this.game.width || !this.game.height) return;
    this.targetX = target.x + target.width / 2 - this.game.width / 2;
    this.targetY = target.y + target.height / 2 - this.game.height / 2;
    this.x += (this.targetX - this.x) * this.smoothness;
    this.y += (this.targetY - this.y) * this.smoothness;
    
    if (this.shakeTimer > 0) {
      this.shakeTimer -= 1/60;
      this.x += (Math.random() - 0.5) * this.shakeAmount;
      this.y += (Math.random() - 0.5) * this.shakeAmount;
    }
    
    this.x = Math.max(0, this.x);
    this.y = Math.max(0, this.y);
    const maxX = Math.max(0, this.game.worldWidth - this.game.width);
    const maxY = Math.max(0, this.game.worldHeight - this.game.height);
    this.x = Math.min(maxX, this.x);
    this.y = Math.min(maxY, this.y);
  }

  shake(amount, duration) {
    this.shakeAmount = amount;
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  }

  applyTransform(ctx) {
    ctx.save();
    ctx.translate(-this.x, -this.y);
    ctx.scale(this.zoom, this.zoom);
  }

  resetTransform(ctx) {
    ctx.restore();
  }
}
