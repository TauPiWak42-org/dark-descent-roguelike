/**
 * SettingsUI
 * \u00041a\u00043e\u00043c\u00043f\u00043e\u00043d\u000435\u00043d\u000442 \u00043d\u000430\u000441\u000442\u000440\u00043e\u000435\u00043a \u000441 \u000432\u00044b\u00043f\u000430\u000434\u00043a\u00043e\u000439 \u000441\u00043f\u000438\u000441\u00043a\u00043e\u00043c
 * TOPDOWN game
 * \u000426\u000432\u000435\u000442\u000430\u00044f \u00043f\u000430\u00043b\u000438\u000442\u000440\u000430: #1a1a2e, #16213e, #1f1f2e
 * \u000417\u00043e\u00043b\u00043e\u000442\u000430: #d4af37, #ffd700, #8b6914
 * @class SettingsUI
 */
export class SettingsUI {
  constructor(game, settingsManager) {
    this.game = game;
    this.settings = settingsManager;
    this.events = game.events;
    
    // \u000421\u00043e\u000441\u000442\u00043e\u00044f\u00043d\u000438\u000435
    this.isOpen = false;
    this.buttonX = 20;
    this.buttonY = 20;
    this.buttonWidth = 40;
    this.buttonHeight = 40;
    this.panelWidth = 300;
    this.panelX = this.buttonX + this.buttonWidth + 10;
    this.panelY = this.buttonY;
    
    // \u00041a\u00043d\u00043e\u00043f\u00043a\u000430 \u000441\u00043b\u000430\u000439\u000434\u000435\u000440\u000430
    this.sliderWidth = 150;
    this.sliderHeight = 20;
    
    // \u00041f\u000440\u000435\u000434\u00044b\u000434\u000443\u000449\u000430\u00044f \u00043d\u000430\u000436\u000430\u000442\u000438\u00044f \u00043d\u000430 \u00043a\u00043d\u00043e\u00043f\u00043a\u000443
    this.prevMouseDown = false;
    this.wasMouseDownOnButton = false;
    this.wasMouseDownOnPanel = false;
    
    this.setupEvents();
  }

  /**
   * \u00041e\u000447\u000438\u000441\u000442\u00043a\u000430 \u000441\u00043b\u000443\u000448\u000430\u000442\u000435\u00043b\u000435\u000439
   */
  cleanup() {
    // \u000423\u000434\u000430\u00043b\u00044f\u000435\u00043c \u000441\u00043b\u000443\u000448\u000430\u000442\u000435\u00043b\u000438 \u000438\u000437 \u000435\u000432\u000435\u00043d\u000442\u000430\u00043c
    for (const unsubscribe of this.unsubscribers || []) {
      unsubscribe();
    }
    this.unsubscribers = [];
  }

  /**
   * \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u000441\u00043o\u000431\u00044b\u000442\u000438\u000439
   * @private
   */
  setupEvents() {
    this.unsubscribers = [];
    const unsubscribeRender = this.events.on('game:render', (ctx) => this.render(ctx));
    const unsubscribeUpdate = this.events.on('game:update', (deltaTime) => this.update(deltaTime));
    this.unsubscribers.push(unsubscribeRender, unsubscribeUpdate);
  }

  /**
   * \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u00043a\u00043e\u00043e\u000440\u000434\u000438\u00043d\u000430\u000442\u000430 \u000432 \u000440\u000443\u000433\u000442\u000435\u000447\u000442\u00043e\u000447\u00043a\u000435
   * @param {number} x - \u00041a\u00043e\u00043e\u000440\u000434\u000438\u00043d\u000430\u000442\u000430 X
   * @param {number} y - \u00041a\u00043e\u00043e\u000440\u000434\u000438\u00043d\u000430\u000442\u000430 Y
   * @returns {boolean}
   * @private
   */
  isPointInRect(x, y, rectX, rectY, rectW, rectH) {
    return x >= rectX && x <= rectX + rectW && y >= rectY && y <= rectY + rectH;
  }

  /**
   * \u00041e\u000431\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u000441\u00043e\u000441\u000442\u00043e\u00044f\u00043d\u000438\u000439
   * @param {number} deltaTime
   * @private
   */
  update(deltaTime) {
    // \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u00043d\u000430\u000436\u000430\u000442\u000438\u000435 \u00043d\u000430 \u000438\u000433\u000440\u000435
    if (this.game.state !== 'playing') return;
    
    // \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u00043c\u00044b\u000448\u000438 \u000432 \u00043e\u000434\u00043d\u00043e\u00043c \u00043c\u00043e\u000432\u000435\u00043d\u000442\u000430
    if (this.game.input) {
      const mouseX = this.game.input.getMousePosition().x;
      const mouseY = this.game.input.getMousePosition().y;
      const isMousePressed = this.game.input.isMousePressed();
      const mouseDown = this.game.input.isMouseDown();
      
      // \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u00043d\u000430\u000436\u000430\u000442\u000438\u00044f \u00043d\u000430 \u00043a\u00043d\u00043e\u00043f\u00043a\u000443 \u000441\u000435\u000442\u000442\u000438\u00043d\u000437\u00043e\u000432
      const gearButtonClicked = this.isPointInRect(mouseX, mouseY, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
      
      // Toggle settings panel on gear button click
      if (isMousePressed && gearButtonClicked) {
        this.isOpen = !this.isOpen;
        this.wasMouseDownOnButton = true;
      }
      
      // Handle panel clicks when open
      if (this.isOpen && isMousePressed && !this.wasMouseDownOnButton) {
        const panelClicked = this.isPointInRect(mouseX, mouseY, this.panelX, this.panelY, this.panelWidth, 220);
        if (panelClicked) {
          this.handlePanelClick(mouseX, mouseY);
        } else {
          // Close panel if clicking outside
          this.isOpen = false;
        }
      }
      
      // Reset button state
      this.prevMouseDown = mouseDown;
      this.wasMouseDownOnButton = false;
    }
  }

  /**
   * \u00041e\u000431\u000440\u000430\u000431\u00043e\u000442\u000430 \u00043a\u00043b\u000438\u00043a\u000430 \u000432 \u00043f\u000430\u00043d\u000435\u00043b\u000438 \u00043d\u000430\u000441\u000442\u000440\u00043e\u000435\u00043a
   * @param {number} mouseX
   * @param {number} mouseY
   * @private
   */
  handlePanelClick(mouseX, mouseY) {
    const settings = this.settings.getSettings();
    const padding = 15;
    const lineHeight = 30;
    let y = this.panelY + padding;
    
    // Sound Enable toggle
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding, y, 100, 20)) {
      this.settings.setSoundEnabled(!settings.soundEnabled);
      this.settings.saveSettings();
      return;
    }
    y += lineHeight;
    
    // Sound Volume (-)
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding, y, 30, 20)) {
      this.settings.decreaseSoundVolume();
      this.settings.saveSettings();
      return;
    }
    // Sound Volume (+)
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding + this.sliderWidth + 40, y, 30, 20)) {
      this.settings.increaseSoundVolume();
      this.settings.saveSettings();
      return;
    }
    y += lineHeight;
    
    // UI Scale (-)
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding, y, 30, 20)) {
      this.settings.decreaseUiScale();
      this.settings.saveSettings();
      return;
    }
    // UI Scale (+)
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding + this.sliderWidth + 40, y, 30, 20)) {
      this.settings.increaseUiScale();
      this.settings.saveSettings();
      return;
    }
    y += lineHeight;
    
    // Font Scale (-)
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding, y, 30, 20)) {
      this.settings.decreaseFontScale();
      this.settings.saveSettings();
      return;
    }
    // Font Scale (+)
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding + this.sliderWidth + 40, y, 30, 20)) {
      this.settings.increaseFontScale();
      this.settings.saveSettings();
      return;
    }
    y += lineHeight;
    
    // Debug Mode toggle
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding, y, 100, 20)) {
      const newDebugMode = !settings.debugMode;
      this.settings.setDebugMode(newDebugMode);
      this.game.debugMode = newDebugMode;
      this.settings.saveSettings();
      return;
    }
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c UI
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    const settings = this.settings.getSettings();
    
    // \u00041a\u00043d\u00043e\u00043f\u00043a\u000430 \u000441\u000435\u000442\u000442\u000438\u00043d\u000437\u00043e\u000432
    this.renderGearButton(ctx);
    
    // \u00041f\u000430\u00043d\u000435\u00043b\u00044c \u00043d\u000430\u000441\u000442\u000440\u00043e\u000435\u00043a
    if (this.isOpen) {
      this.renderSettingsPanel(ctx, settings);
    }
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u00043a\u00043d\u00043e\u00043f\u00043a\u000438 \u000448\u000435\u000441\u000442\u000435\u000440\u00043d\u000438
   * @param {CanvasRenderingContext2D} ctx
   * @private
   */
  renderGearButton(ctx) {
    ctx.save();
    ctx.resetTransform();
    
    // \u000424\u00043e\u00043d \u00043a\u00043d\u00043e\u00043f\u00043a\u000438
    ctx.fillStyle = 'rgba(26, 26, 46, 0.7)';
    ctx.fillRect(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
    
    // \u000417\u00043e\u00043b\u00043e\u000442\u000430\u00044f \u00043e\u00043a\u000440\u000443\u000436\u000430\u00043b\u00043a\u000430
    ctx.strokeStyle = this.isOpen ? '#ffd700' : '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
    
    // \u000418\u00043a\u00043e\u00043d\u00043a\u000430 \u000448\u000435\u000441\u000442\u000435\u000440\u00043d\u000438
    const centerX = this.buttonX + this.buttonWidth / 2;
    const centerY = this.buttonY + this.buttonHeight / 2;
    const radius = 8;
    
    // \u00041e\u000441\u00043d\u00043e\u000432\u00043d\u000430\u00044f \u00043a\u000440\u000443
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // \u000417\u000443\u000431\u000447\u000430 \u000432 \u000446\u000435\u00043d\u000442\u000440\u000435
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // \u000417\u000443\u000431\u00044b \u000448\u000435\u000441\u000442\u000435\u000440\u00043d\u000438
    const toothSize = 3;
    const angleStep = Math.PI / 4;
    for (let i = 0; i < 8; i++) {
      const angle = i * angleStep;
      const x1 = centerX + Math.cos(angle) * (radius / 2);
      const y1 = centerY + Math.sin(angle) * (radius / 2);
      
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(x1 - toothSize / 2, y1 - toothSize / 2, toothSize, toothSize);
    }
    
    ctx.restore();
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u00043f\u000430\u00043d\u000435\u00043b\u000438 \u00043d\u000430\u000441\u000442\u000440\u00043e\u000435\u00043a
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} settings
   * @private
   */
  renderSettingsPanel(ctx) {
    const settings = this.settings.getSettings();
    ctx.save();
    ctx.resetTransform();
    
    const padding = 15;
    const lineHeight = 30;
    let y = this.panelY + padding;
    
    // \u000424\u00043e\u00043d \u00043f\u000430\u00043d\u000435\u00043b\u000438
    ctx.fillStyle = 'rgba(26, 26, 46, 0.9)';
    ctx.fillRect(this.panelX, this.panelY, this.panelWidth, 220);
    
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.panelX, this.panelY, this.panelWidth, 220);
    
    // \u000417\u000430\u000433\u00043e\u00043b\u00043e\u000432\u00043e\u00043a
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 14px Georgia';
    ctx.textAlign = 'left';
    ctx.fillText('Settings', this.panelX + padding, this.panelY + padding - 5);
    
    ctx.font = '12px Georgia';
    ctx.fillStyle = '#e0d5c1';
    
    // \u000417\u000423\u000443\u00043a
    y += 5;
    
    // Sound Enable
    this.renderToggle(ctx, this.panelX + padding, y, 100, 20, 'Sound', settings.soundEnabled);
    y += lineHeight;
    
    // Sound Volume
    this.renderSliderRow(ctx, this.panelX + padding, y, settings.soundVolume, 'Volume');
    y += lineHeight;
    
    // UI Scale
    this.renderSliderRow(ctx, this.panelX + padding, y, settings.uiScale, 'UI Scale');
    y += lineHeight;
    
    // Font Scale
    this.renderSliderRow(ctx, this.panelX + padding, y, settings.fontScale, 'Font Scale');
    y += lineHeight;
    
    // Debug Mode
    this.renderToggle(ctx, this.panelX + padding, y, 100, 20, 'Debug', settings.debugMode);
    
    ctx.restore();
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u000442\u000443\u00043c\u000431\u00043b\u000435\u000440
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string} label
   * @param {boolean} enabled
   * @private
   */
  renderToggle(ctx, x, y, width, height, label, enabled) {
    // \u00041b\u000430\u000431\u000435\u00043b
    ctx.fillStyle = '#e0d5c1';
    ctx.font = '12px Georgia';
    ctx.textAlign = 'left';
    ctx.fillText(label, x, y + height / 2 + 4);
    
    // \u00041f\u000440\u00044f\u00043c\u00043e\u00043f\u00043e\u00043b\u00043d\u00044b\u000439 \u000442\u000443\u000433\u00043c\u00043b\u000435\u000440
    const toggleX = x + width + 20;
    ctx.fillStyle = enabled ? '#4caf50' : '#6b4c2a';
    ctx.fillRect(toggleX, y, 40, height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '10px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(enabled ? 'ON' : 'OFF', toggleX + 20, y + height / 2 + 3);
    
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.strokeRect(toggleX, y, 40, height);
    
    ctx.textAlign = 'left';
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u000441\u00043b\u000430\u000439\u000434\u000435\u000440
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} value
   * @param {string} label
   * @private
   */
  renderSliderRow(ctx, x, y, value, label) {
    // \u00041b\u000430\u000431\u000435\u00043b
    ctx.fillStyle = '#e0d5c1';
    ctx.font = '12px Georgia';
    ctx.textAlign = 'left';
    ctx.fillText(label, x, y + 15);
    
    // [-] button
    ctx.fillStyle = '#6b4c2a';
    ctx.fillRect(x + 80, y, 30, 20);
    ctx.fillStyle = '#e0d5c1';
    ctx.font = '14px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('-', x + 80 + 15, y + 15);
    
    // \u000441\u00043b\u000430\u000439\u000434\u000435\u000440
    const sliderX = x + 120;
    this.renderSlider(ctx, sliderX, y, this.sliderWidth, 20, value);
    
    // Value text
    ctx.fillStyle = '#e0d5c1';
    ctx.font = '12px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(`${value}%`, sliderX + this.sliderWidth / 2, y + 15);
    
    // [+] button
    ctx.fillStyle = '#6b4c2a';
    ctx.fillRect(x + 80 + this.sliderWidth + 30, y, 30, 20);
    ctx.fillStyle = '#e0d5c1';
    ctx.font = '14px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('+', x + 80 + this.sliderWidth + 45, y + 15);
    
    // Reset text align
    ctx.textAlign = 'left';
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u000441\u00043b\u000430\u000439\u000434\u000435\u000440
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} value
   * @private
   */
  renderSlider(ctx, x, y, width, height, value) {
    // Track
    ctx.fillStyle = '#4a3520';
    ctx.fillRect(x, y + height / 2 - 2, width, 4);
    
    // Fill
    const fillWidth = (value / 100) * width;
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(x, y + height / 2 - 2, fillWidth, 4);
    
    // Thumb
    ctx.fillStyle = '#8b6914';
    ctx.beginPath();
    ctx.arc(x + fillWidth, y + height / 2, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}
