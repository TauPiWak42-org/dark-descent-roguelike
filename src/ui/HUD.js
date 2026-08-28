/**
 * \u000413\u00043e\u00043b\u00043e\u000432\u000430\u00044f \u000438\u000433\u000440\u00043e\u00043a\u000430
 * \u00041e\u000442\u00043e\u000431\u000440\u000430\u000436\u000435\u00043d\u000438\u000435 \u000437\u000434\u00043e\u000440\u00043e\u000432\u00044c\u00044e, \u00043c\u000430\u00043d\u00044b \u000438 \u000434\u000440\u000443\u000433\u000438\u000435
 * TOPDOWN game - HUD is screen-space, not affected by camera
 * \u000426\u000432\u000435\u000442\u00043e\u000432\u000430\u00044f \u00043f\u000430\u00043b\u000438\u000442\u000440\u000430: #1a1a2e, #16213e, #1f1f2e
 * \u000417\u00043e\u00043b\u00043e\u000442\u00043e: #d4af37, #ffd700, #8b6914
 * \u000422\u000435\u00043c\u00043d\u00044b\u000435 \u000430\u00043a\u000446\u000435\u00043d\u000442\u00044b: #2d1b00, #4a3520, #6b4c2a
 * \u000422\u000435\u00043a\u000441\u000442: #e0d5c1, #b8a88a, #7a6b54
 * \u00041d\u000435\u00043b\u000435\u00043c\u000435\u00043d\u000442\u00044b: \u00043e\u000433\u00043e\u00043d\u00044c #ff6b35, \u00043b\u000451\u000434 #7ec8e3, \u00044f\u000434 #7cb342, \u00043a\u000440\u00043e\u000432\u00044c #8b0000, \u000434\u000443\u000448\u000438 #9b59b6
 * @class HUD
 */
export class HUD {
  constructor(game, player) {
    this.game = game;
    this.player = player;
    this.events = game.events;
    
    // \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u00043a\u00043e\u00043c\u00043f\u00043e\u00043d\u000435\u00043d\u000442\u00043e\u000432
    this.healthBarWidth = 150;
    this.healthBarHeight = 18;
    this.manaBarWidth = 150;
    this.manaBarHeight = 14;
    
    // \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u00043c\u000435\u000441\u000442\u00043e\u00043f\u00043e\u00043b\u00043e\u000436\u000435\u00043d\u000438\u00044f
    this.setupEvents();
  }

  /**
   * \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u000441\u00043e\u000431\u00044b\u000442\u000438\u000439
   * @private
   */
  setupEvents() {
    this.unsubscribers = [];
    const unsubscribeRender = this.events.on('game:render', (ctx) => this.render(ctx));
    this.unsubscribers.push(unsubscribeRender);
  }

  /**
   * \u00041e\u000447\u000438\u000441\u000442\u00043a\u000430 \u000441\u00043b\u000443\u000448\u000430\u000442\u000435\u00043b\u00044c
   */
  cleanup() {
    for (const unsubscribe of this.unsubscribers) {
      unsubscribe();
    }
    this.unsubscribers = [];
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c HUD
   * TOPDOWN: HUD is always rendered in screen space
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    ctx.save();
    
    // \u000421\u000431\u000440\u00043e\u000441 \u000442\u000440\u000430\u00043d\u000441\u000444\u00043e\u000440\u00043c\u000430\u000446\u000438\u000439
    ctx.resetTransform();
    
    const margin = 20;
    const rightAlignX = this.game.width - margin;
    
    // ============================================
    // \u00041f\u000440\u000430\u000432\u00044b\u000439 \u000432\u000435\u000440\u000445\u00043d\u000438\u000439 \u000443\u000433\u00043e\u00043b - HP \u000438 MP
    // ============================================
    
    // HP Bar - \u000432 \u00043f\u000440\u000430\u000432\u00043e\u000439 \u000432\u000435\u000440\u000445\u00043d\u000435\u00043c \u000432\u00044b\u000440\u000430\u000432\u00043d\u000435\u00043d\u00043e\u00043c \u00043f\u00043e \u00043f\u000440\u000430\u000432\u00043e\u00043c\u000443 \u00043a\u000440\u000430\u00044e
    this.renderHealthBar(ctx, rightAlignX, margin);
    
    // MP Bar - \u00043f\u00043e\u000434 HP
    this.renderManaBar(ctx, rightAlignX, margin + 25);
    
    // ============================================
    // \u00041c\u000435\u000441\u000442\u00043e \u000432 \u00043f\u000440\u000430\u000432\u00043e\u000439 \u000432\u000435\u000440\u000445\u00043d\u000435\u00043c \u000443\u000433\u00043b\u000443
    
    // Currency display in top-right corner with text format
    // Format: X : GOLD
    this.renderCurrency(ctx, rightAlignX, margin + 50, this.player.gold, 'GOLD');
    
    // Format: X : SOUL
    this.renderCurrency(ctx, rightAlignX, margin + 80, this.player.souls, 'SOUL');
    
    // ============================================
    // \u000423\u000440\u00043e\u000432\u000435\u00043d\u00044c \u000438 \u00043e\u00043f\u00044b\u000442
    this.renderExperience(ctx);
    
    // \u00041d\u00043e\u00043c\u000435\u000440 \u000443\u000440\u00043e\u000432\u00043d\u00044f
    this.renderLevel(ctx);
    
    // Отображение статусов
    this.renderStatusEffects(ctx);
  }

  /**
   * Отрисовка статусных эффектов
   * @param {CanvasRenderingContext2D} ctx
   * @private
   */
  renderStatusEffects(ctx) {
    // statusEffects не существует в Player, метод будет реализован позже
    // Пока просто пропускаем отрисовку статусов
    return;
  }

  /**
   * Отрисовка фона карты (пол и стены)
   * @param {CanvasRenderingContext2D} ctx
   * @param {Camera} camera
   * @private
   */
  renderMapBackground(ctx, camera) {
    const startTileX = Math.floor(camera.x / this.tileSize);
    const startTileY = Math.floor(camera.y / this.tileSize);
    const endTileX = Math.ceil((camera.x + camera.game.width) / this.tileSize);
    const endTileY = Math.ceil((camera.y + camera.game.height) / this.tileSize);
    
    for (let y = startTileY; y <= endTileY && y < this.height; y++) {
      for (let x = startTileX; x <= endTileX && x < this.width; x++) {
        const screenX = x * this.tileSize - camera.x;
        const screenY = y * this.tileSize - camera.y;
        
        if (this.map[y] && this.map[y][x] === 1) {
          // Стена - тёмно-синий блок
          ctx.fillStyle = '#0a1628';
          ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
          ctx.strokeStyle = '#1a2a3a';
          ctx.lineWidth = 1;
          ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
        } else {
          // Пол - просто серый с небольшим variation
          const toneVariation = ((x + y) % 3) * 3;
          ctx.fillStyle = `rgb(${35 + toneVariation}, ${35 + toneVariation}, ${40 + toneVariation})`;
          ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
        }
      }
    }
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u00043f\u000430\u00043d\u000435\u00043b\u00044c \u000437\u000434\u00043e\u000440\u00043e\u000432\u00044c\u00044f
   * \u000426\u000432\u000435\u000442: \u000424\u00043e\u00043b\u00043e\u000441\u000430 #2d1b00, \u00043e\u000441\u00043d\u00043e\u000432\u00043d\u000430\u00044f #4a3520
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} rightX - \u00041f\u00043e\u000437\u000438\u000446\u000438\u00044f X (\u000432\u00044b\u000440\u000430\u000432\u00043d\u000435\u00043d\u00043e \u00043f\u00043e \u00043f\u000440\u000430\u000432\u00043e\u00043c\u000443 \u00043a\u000440\u000430\u00044e)
   * @param {number} y - \u00041f\u00043e\u000437\u000438\u000446\u000438\u00044f Y
   * @private
   */
  renderHealthBar(ctx, rightX, y) {
    const barWidth = this.healthBarWidth;
    const barHeight = this.healthBarHeight;
    const x = rightX - barWidth;
    
    // \u000424\u00043e\u00043d \u00043f\u000430\u00043d\u000435\u00043b\u000438 \u000441\u000442\u000435\u00043d\u000430\u000432
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4);
    
    // \u000417\u00043e\u00043b\u00043e\u000442\u000430\u00044f \u00043e\u000440\u00043d\u000430\u00043c\u000430\u00043a\u000430
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 2, y - 2, barWidth + 4, barHeight + 4);
    
    // \u00041e\u000441\u00043d\u00043e\u000432\u00043d\u000430\u00044f \u00043f\u000430\u00043b\u00043e\u000441\u000430
    const healthPercent = this.player.health / this.player.maxHealth;
    const fillWidth = barWidth * healthPercent;
    
    // \u000426\u000432\u000435\u000442\u000430 \u000437\u000434\u00043e\u000440\u00043e\u000432\u00044c\u00044f: \u000437\u000435\u00043b\u000451\u00043d\u00044b\u000439 >50%, \u00043e\u000440\u000430\u00043d\u000436\u000435\u000432\u00044b\u000439 >25%, \u00043a\u000440\u000430\u000441\u00043d\u00044b\u000439 <=25%
    if (healthPercent > 0.5) {
      ctx.fillStyle = '#4caf50';
    } else if (healthPercent > 0.25) {
      ctx.fillStyle = '#ff9800';
    } else {
      ctx.fillStyle = '#8b0000';
    }
    ctx.fillRect(x, y, fillWidth, barHeight);
    
    // \u00041e\u000431\u000440\u000430\u00043c\u00043a\u000430 - \u000437\u00043e\u00043b\u00043e\u000442\u00044b\u000435 \u00043e\u000440\u00043d\u000430\u00043c\u000435\u00043d\u000442\u00044b
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 12px Georgia';
    ctx.textAlign = 'right';
    ctx.fillText(`HP: ${Math.floor(this.player.health)}/${this.player.maxHealth}`, rightX - 4, y + barHeight / 2 + 5);
    ctx.textAlign = 'left';
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u00043c\u000430\u00043d\u000443
   * \u000426\u000432\u000435\u000442: \u000424\u00043e\u00043b\u00043e\u000441\u000430 #2d1b00, \u00043e\u000441\u00043d\u00043e\u000432\u00043d\u000430\u00044f #4a3520
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} rightX - \u00041f\u00043e\u000437\u000438\u000446\u000438\u00044f X (\u000432\u00044b\u000440\u000430\u000432\u00043d\u000435\u00043d\u00043e \u00043f\u00043e \u00043f\u000440\u000430\u000432\u00043e\u00043c\u000443 \u00043a\u000440\u000430\u00044e)
   * @param {number} y - \u00041f\u00043e\u000437\u000438\u000446\u000438\u00044f Y
   * @private
   */
  renderManaBar(ctx, rightX, y) {
    const barWidth = this.manaBarWidth;
    const barHeight = this.manaBarHeight;
    const x = rightX - barWidth;
    
    // \u000424\u00043e\u00043d \u00043f\u000430\u00043d\u000435\u00043b\u000438 \u000441\u000442\u000435\u00043d\u000430\u000432
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4);
    
    // \u000417\u00043e\u00043b\u00043e\u000442\u000430\u00044f \u00043e\u000440\u00043d\u000430\u00043c\u000430\u00043a\u000430
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 2, y - 2, barWidth + 4, barHeight + 4);
    
    // \u00041e\u000441\u00043d\u00043e\u000432\u00043d\u000430\u00044f \u00043c\u000430\u00043d\u00044b
    const manaPercent = this.player.mana / this.player.maxMana;
    const fillWidth = barWidth * manaPercent;
    
    // \u000426\u000432\u000435\u000442 \u00043c\u000430\u00043d\u00044b: \u000441\u000438\u00043d\u000438\u000439 #2196f3
    ctx.fillStyle = '#7ec8e3';
    ctx.fillRect(x, y, fillWidth, barHeight);
    
    // \u00041e\u000431\u000440\u000430\u00043c\u00043a\u000430
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 10px Georgia';
    ctx.textAlign = 'right';
    ctx.fillText(`MP: ${Math.floor(this.player.mana)}/${this.player.maxMana}`, rightX - 4, y + barHeight / 2 + 4);
    ctx.textAlign = 'left';
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u000441\u000447\u000435\u000442
   * TOPDOWN: Currency display format: X : GOLD / X : SOUL
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x - \u00041f\u00043e\u000437\u000438\u000446\u000438\u00044f X
   * @param {number} y - \u00041f\u00043e\u000437\u000438\u000446\u000438\u00044f Y
   * @param {number} amount - \u00041a\u00043e\u00043b\u000438\u000447\u000435\u000441\u000442\u000432\u00043e
   * @param {string} label - \u00041d\u000430\u000434\u00043f\u000438\u000441\u00044c (GOLD or SOUL)
   * @private
   */
  renderCurrency(ctx, x, y, amount, label) {
    ctx.save();
    
    // \u000424\u00043e\u00043d \u00043f\u000430\u00043d\u000435\u00043b\u000438
    ctx.fillStyle = 'rgba(26, 26, 46, 0.7)';
    ctx.fillRect(x - 100, y - 5, 100, 25);
    
    // \u000413\u000440\u000430\u00043d\u000438\u000446\u000430
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 100, y - 5, 100, 25);
    
    // \u000422\u000435\u00043a\u000441\u000442 \u000444\u00043e\u000440\u00043c\u000430\u000442\u000430: "X : GOLD" \u000438\u00043b\u000438 "X : SOUL"
    ctx.fillStyle = label === 'GOLD' ? '#ffd700' : '#9b59b6';
    ctx.font = 'bold 14px Georgia';
    ctx.textAlign = 'right';
    
    const displayText = `${amount} : ${label}`;
    ctx.fillText(displayText, x - 10, y + 15);
    
    ctx.textAlign = 'left';
    ctx.restore();
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u00043e\u00043f\u00044b\u000442
   * @param {CanvasRenderingContext2D} ctx
   * @private
   */
  renderExperience(ctx) {
    const x = this.game.width - 220;
    const y = this.game.height - 40;
    
    // \u000424\u00043e\u00043d
    ctx.fillStyle = 'rgba(26, 26, 46, 0.7)';
    ctx.fillRect(x, y, 200, 20);
    
    // \u00041e\u000431\u000440\u000430\u00043c\u00043a\u000430
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, 200, 20);
    
    // \u000417\u000430\u00043f\u00043e\u00043b\u00043d\u000435\u00043d\u000438\u000435
    const expPercent = this.player ? (this.player.xp % 100) / 100 : 0;
    ctx.fillStyle = '#ff6b35';
    ctx.fillRect(x + 2, y + 2, 196 * expPercent, 16);
    
    // \u000422\u000435\u00043a\u000441\u000442
    ctx.fillStyle = '#ffd700';
    ctx.font = '10px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(`EXP: ${this.player ? this.player.xp : 0}`, x + 100, y + 14);
    ctx.textAlign = 'left';
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u000443\u000440\u00043e\u000432\u000435\u00043d\u00044c
   * @param {CanvasRenderingContext2D} ctx
   * @private
   */
  renderLevel(ctx) {
    const x = this.game.width - 100;
    const y = this.game.height - 60;
    
    ctx.fillStyle = 'rgba(26, 26, 46, 0.7)';
    ctx.fillRect(x, y, 80, 20);
    
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, 80, 20);
    
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 12px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(`Lv. ${this.player ? this.player.floor : 1}`, x + 40, y + 14);
    ctx.textAlign = 'left';
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u000441\u000442\u000430\u000442\u000443\u000441\u00044b
   * @param {CanvasRenderingContext2D} ctx
   * @private
   */
  renderStatusEffects(ctx) {
    // statusEffects не существует в Player, метод будет реализован позже
    // Пока просто пропускаем отрисовку статусов
    return;
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u00043e\u000442\u00043b\u000430\u000434\u00043e\u000447\u00043d\u000443\u00044e \u000438\u00043d\u000444\u00043e\u000440\u00043c\u000430\u000446\u000438\u00044e
   * @param {CanvasRenderingContext2D} ctx
   * @private
   */
  renderDebugInfo(ctx) {
    const x = 20;
    const y = this.game.height - 150;
    
    ctx.fillStyle = 'rgba(26, 26, 46, 0.7)';
    ctx.fillRect(x, y, 250, 120);
    
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, 250, 120);
    
    ctx.fillStyle = '#ffd700';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    const player = this.player;
    if (player) {
      ctx.fillText(`Pos: (${player.x.toFixed(1)}, ${player.y.toFixed(1)})`, x + 10, y + 20);
      ctx.fillText(`Speed: (${player.vx.toFixed(1)}, ${player.vy.toFixed(1)})`, x + 10, y + 40);
      ctx.fillText(`Facing: ${player.facing}`, x + 10, y + 60);
    }
    
    ctx.fillText(`State: ${this.game.state}`, x + 10, y + 80);
    ctx.fillText(`FPS: ${Math.round(1000 / 16.67)}`, x + 10, y + 100);
    
    ctx.textAlign = 'left';
  }
}
