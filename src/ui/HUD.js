/**
 * HUD (Heads-Up Display)
 * 1e423e31403036303542 37343e403e324c, 3c303d43, 4035414340414b 38 383d443e403c3046384f 3e31 4d42303635
 * @class HUD
 */
export class HUD {
  constructor(game, player) {
    this.game = game;
    this.player = player;
    this.events = game.events;
    
    this.setupEvents();
  }

  /**
   * 1d304142403e393a30 413e314b423839
   * @private
   */
  setupEvents() {
    this.events.on('game:render', (ctx) => this.render(ctx));
  }

  /**
   * 1e424038413e323a30 HUD
   * @param {CanvasRenderingContext2D} ctx - 1a3e3d42353a4142 canvas
   */
  render(ctx) {
    // 1f4030324b39 323540453d3839 43333e3b - 3130404b 37343e403e324c4f 38 3c303d30
    this.renderHealthBar(ctx);
    this.renderManaBar(ctx);
    
    // 1f4030324b39 323540453d3839 43333e3b - 4147514247383a38 373e3b3e4230 38 344348
    this.renderCurrency(ctx);
    
    // 1d3e3c3540 4d42303630
    this.renderFloorInfo(ctx);
  }

  /**
   * 1e424038413e323a30 3f3e3b3e4130 37343e403e324c4f
   * @param {CanvasRenderingContext2D} ctx - 1a3e3d42353a4142 canvas
   * @private
   */
  renderHealthBar(ctx) {
    const padding = 20;
    const width = 180;
    const height = 25;
    const x = this.game.width - width - padding;
    const y = padding;
    
    // 243e3d
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, width, height);
    
    // 1f3e3b3e4130 37343e403e324c4f
    const healthPercent = this.player.health / this.player.maxHealth;
    const healthWidth = width * healthPercent;
    
    // 1340303438353d42 37343e403e324c4f
    const gradient = ctx.createLinearGradient(x, y, x + healthWidth, y);
    gradient.addColorStop(0, '#8b0000');
    gradient.addColorStop(0.5, '#cc0000');
    gradient.addColorStop(1, '#ff4444');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x + 2, y + 2, healthWidth - 4, height - 4);
    
    // 173e3b3e42304f 40303c3a30
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    
    // 22353a4142
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Georgia';
    ctx.textAlign = 'right';
    ctx.fillText(
      `${Math.ceil(this.player.health)} / ${this.player.maxHealth}`,
      x + width - 5,
      y + height / 2 + 5
    );
    
    // 1b30313b
    ctx.fillStyle = '#e0d5c1';
    ctx.font = 'bold 12px Georgia';
    ctx.textAlign = 'left';
    ctx.fillText('HP:', x + 5, y + height / 2 + 5);
    
    ctx.textAlign = 'left';
  }

  /**
   * 1e424038413e323a30 3f3e3b3e4130 3c303d4b
   * @param {CanvasRenderingContext2D} ctx - 1a3e3d42353a4142 canvas
   * @private
   */
  renderManaBar(ctx) {
    const padding = 20;
    const width = 180;
    const height = 20;
    const x = this.game.width - width - padding;
    const y = padding + 30;
    
    // 243e3d
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, width, height);
    
    // 1f3e3b3e4130 3c303d4b
    const manaPercent = this.player.mana / this.player.maxMana;
    const manaWidth = width * manaPercent;
    
    // 1340303438353d42 3c303d4b
    const gradient = ctx.createLinearGradient(x, y, x + manaWidth, y);
    gradient.addColorStop(0, '#00008b');
    gradient.addColorStop(0.5, '#4444ff');
    gradient.addColorStop(1, '#8888ff');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x + 2, y + 2, manaWidth - 4, height - 4);
    
    // 173e3b3e42304f 40303c3a30
    ctx.strokeStyle = '#8b6914';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    
    // 22353a4142
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Georgia';
    ctx.textAlign = 'right';
    ctx.fillText(
      `${Math.ceil(this.player.mana)} / ${this.player.maxMana}`,
      x + width - 5,
      y + height / 2 + 4
    );
    
    // 1b30313b
    ctx.fillStyle = '#e0d5c1';
    ctx.font = 'bold 12px Georgia';
    ctx.textAlign = 'left';
    ctx.fillText('MP:', x + 5, y + height / 2 + 4);
    
    ctx.textAlign = 'left';
  }

  /**
   * 1e424038413e323a30 32303b4e424b
   * @param {CanvasRenderingContext2D} ctx - 1a3e3d42353a4142 canvas
   * @private
   */
  renderCurrency(ctx) {
    const padding = 20;
    const x = this.game.width - 220;
    const y = 65;
    
    // 173e3b3e423e
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(x + 10, y + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // 21323547353d3835 373e3b3e4230
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(x + 10, y + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Georgia';
    ctx.textAlign = 'right';
    ctx.fillText(`: ${this.player.gold}`, x + 25, y + 14);
    
    // 14434838
    const soulY = y + 20;
    ctx.fillStyle = '#9b59b6';
    ctx.beginPath();
    ctx.arc(x + 10, soulY + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // 21323547353d3835 344348
    ctx.shadowColor = '#9b59b6';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(x + 10, soulY + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`: ${this.player.souls}`, x + 25, soulY + 14);
    
    ctx.textAlign = 'left';
    
    // 1b30313b4b
    ctx.fillStyle = '#e0d5c1';
    ctx.font = 'bold 12px Georgia';
    ctx.fillText('Gold:', x - 45, y + 14);
    ctx.fillText('Souls:', x - 45, soulY + 14);
  }

  /**
   * 1e424038413e323a30 383d443e403c30463838 3e31 4d42303635
   * @param {CanvasRenderingContext2D} ctx - 1a3e3d42353a4142 canvas
   * @private
   */
  renderFloorInfo(ctx) {
    const text = `Floor ${this.player.floor}`;
    const boxWidth = 100;
    const boxHeight = 25;
    const boxX = this.game.width / 2 - boxWidth / 2;
    const boxY = 10;
    
    // 243e3d
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    
    // 22353a4142
    ctx.fillStyle = '#e0d5c1';
    ctx.font = 'bold 14px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(text, this.game.width / 2, boxY + 17);
    
    // 173e3b3e42304f 40303c3a30
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    
    ctx.textAlign = 'left';
  }
}
