/**
 * \u000421\u000438\u000441\u000442\u000435\u00043c\u000430 \u00043a\u000430\u00043c\u000435\u000440\u00044b
 * \u00041e\u000442\u000432\u000435\u000447\u000430\u000435\u000442 \u000437\u000430 \u000441\u00043b\u000435\u000434\u00043e\u000432\u000430\u00043d\u000438\u00044f \u000437\u000430 \u000446\u000435\u00043b\u00044c\u00044e \u000438 \u000442\u000440\u000430\u00043d\u000441\u000444\u00043e\u000440\u00043c\u000430\u000446\u000438\u000438 \u00043e\u000442\u000440\u000430\u000441\u000442\u00043a\u000430\u000432
 * TOPDOWN game - camera follows player in world coordinates
 * \u000426\u000432\u000435\u000442\u000430\u00044f \u00043f\u000430\u00043b\u00044c\u000437\u00043e\u000432\u000430\u000439: #1a1a2e, #16213e, #1f1f2e
 * @class Camera
 */
export class Camera {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
    
    // \u000422\u000440\u00044f\u000441\u00043a\u000430 \u00043a\u000430\u00043c\u000435\u000440\u00044b
    this.shakeAmount = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
    
    // \u00041f\u00043b\u000430\u000432\u00043d\u00043e\u000435 \u000441\u00043b\u000435\u000434\u00043e\u000432\u000430\u00043d\u000438\u000435
    this.smoothness = 0.2; // \u00041f\u00043e\u000432\u00044b\u000448\u000435\u000435 \u000441\u00043b\u000435\u000434\u00043e\u000432\u000430\u00043d\u000438\u000435 \u000437\u000430 \u000438\u000433\u000440\u00043e\u00043a\u000443
    this.targetX = 0;
    this.targetY = 0;
  }

  /**
   * \u000421\u00043b\u000435\u000434\u00043e\u000432\u000430\u00043d\u000438\u000435 \u000437\u000430 \u000446\u000435\u00043b\u00044c\u00044e
   * TOPDOWN: Camera center follows player center with smoothness
   * @param {Object} target - \u000426\u000435\u00043b\u00044c (\u00043e\u000431\u00044a\u000435\u00043a\u000442\u00043d\u000430\u00044f \u000438\u000433\u000440\u00043e\u00043a)
   */
  follow(target) {
    // TOPDOWN: Center camera on player
    this.targetX = target.x + target.width / 2 - this.game.width / 2;
    this.targetY = target.y + target.height / 2 - this.game.height / 2;
    
    // \u00041f\u00043b\u000430\u000432\u00043d\u00043e\u000435 \u000441\u00043b\u000435\u000434\u00043e\u000432\u000430\u00043d\u000438\u000435
    this.x += (this.targetX - this.x) * this.smoothness * 60;
    this.y += (this.targetY - this.y) * this.smoothness * 60;
    
    // \u000414\u00043e\u000441\u000442\u000430\u000432\u00043b\u000435\u00043d\u000438\u000435 \u000442\u000440\u00044f\u000441\u00043a\u000430 \u000432 \u00043f\u000440\u00043e\u000446\u000435\u000441\u000441\u000435\u000442\u000440\u00044b\u000442\u000430
    if (this.shakeTimer > 0) {
      this.shakeTimer -= 1/60;
      const shakeX = (Math.random() - 0.5) * this.shakeAmount;
      const shakeY = (Math.random() - 0.5) * this.shakeAmount;
      this.x += shakeX;
      this.y += shakeY;
    }
    
    // \u00041e\u000433\u000440\u000430\u00043d\u000438\u000447\u000435\u00043d\u000438\u000435 \u00043f\u000440\u000435\u000434\u000435\u00043b\u00043e\u00043c\u000443 \u00043a\u000430\u00043c\u000435\u000440\u00044b
    this.x = Math.max(0, this.x);
    this.y = Math.max(0, this.y);
    
    // \u00041f\u000440\u000435\u000434\u00043e\u000442\u000432\u000440\u000430\u000448\u000442\u00044c \u000437\u000430 \u000433\u000440\u000430\u00043d\u000438\u000446\u00043b \u00043c\u000438\u000440\u000430
    const maxX = Math.max(0, this.game.worldWidth - this.game.width);
    const maxY = Math.max(0, this.game.worldHeight - this.game.height);
    this.x = Math.min(maxX, this.x);
    this.y = Math.min(maxY, this.y);
  }

  /**
   * \u000412\u000432\u000440\u00044f\u000441\u00043a\u000430 \u000442\u000440\u00044f\u000441\u00043a\u000443 \u000432 \u00043f\u000438\u00043a\u000441\u000435\u00043b\u00044f\u000445
   * @param {number} amount - \u000421\u000438\u00043b\u000430 \u000442\u000440\u00044f\u000441\u00043a\u000430 \u000432 \u00043f\u000438\u00043a\u000441\u000435\u00043b\u00044f\u000445
   * @param {number} duration - \u000414\u00043b\u000438\u000442\u000435\u00043b\u00044c\u00043d\u00043e\u000441\u000442\u00044c \u000432 \u000441\u000435\u00043a\u000443\u00043d\u000434\u000430\u000445
   */
  shake(amount, duration) {
    this.shakeAmount = amount;
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  }

  /**
   * \u00041f\u000440\u000438\u00043c\u000435\u00043d\u000435\u00043d\u000438\u000435 \u000442\u000440\u000430\u00043d\u000441\u000446\u00043e\u000440\u00043c\u000430\u000442\u000442\u000443
   * @param {CanvasRenderingContext2D} ctx - \u00041a\u00043e\u00043d\u000442\u000435\u00043a\u000441\u000442 canvas
   */
  applyTransform(ctx) {
    ctx.save();
    ctx.translate(-this.x, -this.y);
    ctx.scale(this.zoom, this.zoom);
  }

  /**
   * \u000421\u000431\u000440\u000441 \u000442\u000440\u000430\u00043d\u000441\u000446\u00043e\u000440\u00043c\u000430\u000442\u000442\u00043a\u000443
   * @param {CanvasRenderingContext2D} ctx - \u00041a\u00043e\u00043d\u000442\u000435\u00043a\u000441\u000442 canvas
   */
  resetTransform(ctx) {
    ctx.restore();
  }
}
