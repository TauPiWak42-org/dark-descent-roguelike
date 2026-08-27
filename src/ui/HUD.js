/**
 * HUD (Heads-Up Display)
 * Отображает здоровье, ману, ресурсы и информацию об этаже
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
   * Настройка событий
   * @private
   */
  setupEvents() {
    this.events.on('game:render', (ctx) => this.render(ctx));
  }

  /**
   * Отрисовка HUD
   * @param {CanvasRenderingContext2D} ctx - Контекст canvas
   */
  render(ctx) {
    this.renderHealthBar(ctx);
    this.renderManaBar(ctx);
    this.renderCurrency(ctx);
    this.renderFloorInfo(ctx);
  }

  /**
   * Отрисовка полосы здоровья
   * @param {CanvasRenderingContext2D} ctx - Контекст canvas
   * @private
   */
  renderHealthBar(ctx) {
    const x = 20;
    const y = 20;
    const width = 200;
    const height = 25;
    
    // Фон
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, width, height);
    
    // Полоса здоровья
    const healthPercent = this.player.health / this.player.maxHealth;
    const healthWidth = width * healthPercent;
    
    // Градиент здоровья
    const gradient = ctx.createLinearGradient(x, y, x + healthWidth, y);
    gradient.addColorStop(0, '#8b0000');
    gradient.addColorStop(0.5, '#cc0000');
    gradient.addColorStop(1, '#ff4444');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x + 2, y + 2, healthWidth - 4, height - 4);
    
    // Золотая рамка
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    
    // Текст
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${Math.ceil(this.player.health)} / ${this.player.maxHealth}`,
      x + width / 2,
      y + height / 2 + 5
    );
  }

  /**
   * Отрисовка полосы маны
   * @param {CanvasRenderingContext2D} ctx - Контекст canvas
   * @private
   */
  renderManaBar(ctx) {
    const x = 20;
    const y = 50;
    const width = 200;
    const height = 20;
    
    // Фон
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, width, height);
    
    // Полоса маны
    const manaPercent = this.player.mana / this.player.maxMana;
    const manaWidth = width * manaPercent;
    
    // Градиент маны
    const gradient = ctx.createLinearGradient(x, y, x + manaWidth, y);
    gradient.addColorStop(0, '#00008b');
    gradient.addColorStop(0.5, '#4444ff');
    gradient.addColorStop(1, '#8888ff');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x + 2, y + 2, manaWidth - 4, height - 4);
    
    // Золотая рамка
    ctx.strokeStyle = '#8b6914';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    
    // Текст
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${Math.ceil(this.player.mana)} / ${this.player.maxMana}`,
      x + width / 2,
      y + height / 2 + 4
    );
  }

  /**
   * Отрисовка валюты
   * @param {CanvasRenderingContext2D} ctx - Контекст canvas
   * @private
   */
  renderCurrency(ctx) {
    const x = 20;
    const y = 85;
    
    // Золото
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(x + 10, y + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Свечение золота
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(x + 10, y + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Georgia';
    ctx.textAlign = 'left';
    ctx.fillText(`: ${this.player.gold}`, x + 25, y + 16);
    
    // Души
    const soulY = y + 25;
    ctx.fillStyle = '#9b59b6';
    ctx.beginPath();
    ctx.arc(x + 10, soulY + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Свечение душ
    ctx.shadowColor = '#9b59b6';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(x + 10, soulY + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`: ${this.player.souls}`, x + 25, soulY + 16);
  }

  /**
   * Отрисовка информации об этаже
   * @param {CanvasRenderingContext2D} ctx - Контекст canvas
   * @private
   */
  renderFloorInfo(ctx) {
    const text = `Этаж ${this.player.floor}`;
    const boxWidth = 120;
    const boxHeight = 30;
    const boxX = this.game.width / 2 - boxWidth / 2;
    const boxY = 20;
    
    // Фон
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    
    // Текст
    ctx.fillStyle = '#e0d5c1';
    ctx.font = 'bold 16px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(text, this.game.width / 2, boxY + 20);
    
    // Золотая рамка
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
  }
}
