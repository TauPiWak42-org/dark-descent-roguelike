/**
 * SettingsUI
 * 1a3e3c3f3e3d353d42 3d304142403e353a 41 324b3f3034304e49383c 413f38413a3e3c
 * @class SettingsUI
 */
export class SettingsUI {
  constructor(game, settingsManager) {
    this.game = game;
    this.settings = settingsManager;
    this.events = game.events;
    
    // 213e41423e4f3d3835
    this.isOpen = false;
    this.buttonX = 20;
    this.buttonY = 20;
    this.buttonWidth = 40;
    this.buttonHeight = 40;
    this.panelWidth = 300;
    this.panelX = this.buttonX + this.buttonWidth + 10;
    this.panelY = this.buttonY;
    
    // 1a3d3e3f3a30 413b303934354030
    this.sliderWidth = 150;
    this.sliderHeight = 20;
    
    this.setupEvents();
  }

  /**
   * 1d304142403e393a30 413e314b423839
   * @private
   */
  setupEvents() {
    this.events.on('game:render', (ctx) => this.render(ctx));
    this.events.on('game:update', (deltaTime) => this.update(deltaTime));
  }

  /**
   * 1f403e3235403a30 3a3b383a30 3d30 3d303630423835
   * @param {number} x - 1a3e3e4034383d304230 X
   * @param {number} y - 1a3e3e4034383d304230 Y
   * @returns {boolean}
   * @private
   */
  isPointInRect(x, y, rectX, rectY, rectW, rectH) {
    return x >= rectX && x <= rectX + rectW && y >= rectY && y <= rectY + rectH;
  }

  /**
   * 1e313d3e323b353d3835 413e314b423839
   * @param {number} deltaTime
   * @private
   */
  update(deltaTime) {
    // 1f403e3235403a30 3d303630423835 3d30 3a3d3e3f3a35
    if (this.game.state !== 'playing') return;
    
    // 1f403e3235403a30 3a3b383a30 3c4b4838
    if (this.game.input) {
      const { mouseX, mouseY, mouseDown, mouseUp } = this.game.input;
      
      // 1f403e3235403a30 3d303630423835 3d30 3a3d3e3f3a43 41354242383d333e32
      if (mouseDown && this.isPointInRect(mouseX, mouseY, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight)) {
        this.isOpen = !this.isOpen;
      }
      
      // 1e314030313e423a30 3d304142403e393a38 32 3e423a404b423e3c 3f303d353b38
      if (this.isOpen && mouseDown) {
        this.handlePanelClick(mouseX, mouseY);
      }
    }
  }

  /**
   * 1e314030313e423a30 3a3b383a30 32 3f303d353b38 3d304142403e353a
   * @param {number} mouseX
   * @param {number} mouseY
   * @private
   */
  handlePanelClick(mouseX, mouseY) {
    const settings = this.settings.getSettings();
    const padding = 15;
    const lineHeight = 30;
    let y = this.panelY + padding;
    
    // 1f403e3235403a30 323a3b/324b3a3b 3732433a30
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding, y, 100, 20)) {
      this.settings.setSoundEnabled(!settings.soundEnabled);
      return;
    }
    y += lineHeight;
    
    // 1f403e3235403a30 413b303934354030 3732433a30 (-)
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding, y, 30, 20)) {
      this.settings.decreaseSoundVolume();
      return;
    }
    // 1f403e3235403a30 413b303934354030 3732433a30 (+)
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding + this.sliderWidth + 40, y, 30, 20)) {
      this.settings.increaseSoundVolume();
      return;
    }
    y += lineHeight;
    
    // 1f403e3235403a30 413b303934354030 4030373c354030 UI (-)
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding, y, 30, 20)) {
      this.settings.decreaseUiScale();
      return;
    }
    // 1f403e3235403a30 413b303934354030 4030373c354030 UI (+)
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding + this.sliderWidth + 40, y, 30, 20)) {
      this.settings.increaseUiScale();
      return;
    }
    y += lineHeight;
    
    // 1f403e3235403a30 413b303934354030 4030373c3540 484038444230 (-)
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding, y, 30, 20)) {
      this.settings.decreaseFontScale();
      return;
    }
    // 1f403e3235403a30 413b303934354030 4030373c3540 484038444230 (+)
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding + this.sliderWidth + 40, y, 30, 20)) {
      this.settings.increaseFontScale();
      return;
    }
    y += lineHeight;
    
    // 1f403e3235403a30 debug mode
    if (this.isPointInRect(mouseX, mouseY, this.panelX + padding, y, 100, 20)) {
      this.settings.setDebugMode(!settings.debugMode);
      this.game.debugMode = !settings.debugMode;
      return;
    }
  }

  /**
   * 1e424038413e323a30 UI
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    const settings = this.settings.getSettings();
    
    // 1a3d3e3f3a30 41354242383d333e32
    this.renderGearButton(ctx);
    
    // 1f303d353b4c 3d304142403e353a
    if (this.isOpen) {
      this.renderSettingsPanel(ctx, settings);
    }
  }

  /**
   * 1e424038413e3230424c 3a3d3e3f3a38 4835414235403d38
   * @param {CanvasRenderingContext2D} ctx
   * @private
   */
  renderGearButton(ctx) {
    ctx.save();
    
    // 243e3d 3a3d3e3f3a38
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
    
    // 173e3b3e42304f 3e3a404336303b3a30
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
    
    // 183a3e3d3a30 4835414235403d38
    const centerX = this.buttonX + this.buttonWidth / 2;
    const centerY = this.buttonY + this.buttonHeight / 2;
    const radius = 8;
    
    // 1e413d3e323d304f 3a4043
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 1743314730 32 46353d424035
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 1743314b 4835414235403d38
    const toothSize = 3;
    const angleStep = Math.PI / 4;
    for (let i = 0; i < 8; i++) {
      const angle = i * angleStep;
      const x1 = centerX + Math.cos(angle) * (radius / 2);
      const y1 = centerY + Math.sin(angle) * (radius / 2);
      const x2 = centerX + Math.cos(angle) * radius;
      const y2 = centerY + Math.sin(angle) * radius;
      
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(x1 - toothSize / 2, y1 - toothSize / 2, toothSize, toothSize);
    }
    
    ctx.restore();
  }

  /**
   * 1e424038413e3230424c 3f303d353b38 3d304142403e353a
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} settings
   * @private
   */
  renderSettingsPanel(ctx, settings) {
    ctx.save();
    
    const padding = 15;
    const lineHeight = 30;
    let y = this.panelY + padding;
    
    // 243e3d 3f303d353b38
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(this.panelX, this.panelY, this.panelWidth, 220);
    
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.panelX, this.panelY, this.panelWidth, 220);
    
    // 1730333e3b3e323e3a
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 14px Georgia';
    ctx.textAlign = 'left';
    ctx.fillText('Settings', this.panelX + padding, this.panelY + padding - 5);
    
    ctx.font = '12px Georgia';
    ctx.fillStyle = '#e0d5c1';
    
    // 1732433a
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
   * 1e424038413e3230424c 42433c313b3540
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
    // 1b3031353b
    ctx.fillStyle = '#e0d5c1';
    ctx.font = '12px Georgia';
    ctx.textAlign = 'left';
    ctx.fillText(label, x, y + height / 2 + 4);
    
    // 1f404f3c3e433e3b3d4b39 4243333c3b3540
    const toggleX = x + width + 20;
    ctx.fillStyle = enabled ? '#4caf50' : '#555';
    ctx.fillRect(toggleX, y, 40, height);
    
    ctx.fillStyle = '#fff';
    ctx.font = '10px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(enabled ? 'ON' : 'OFF', toggleX + 20, y + height / 2 + 3);
    
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.strokeRect(toggleX, y, 40, height);
  }

  /**
   * 1e424038413e3230424c 413b3039343540
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} value
   * @param {string} label
   * @private
   */
  renderSliderRow(ctx, x, y, value, label) {
    // 1b3031353b
    ctx.fillStyle = '#e0d5c1';
    ctx.font = '12px Georgia';
    ctx.textAlign = 'left';
    ctx.fillText(label, x, y + 15);
    
    // [-] button
    ctx.fillStyle = '#555';
    ctx.fillRect(x + 80, y, 30, 20);
    ctx.fillStyle = '#fff';
    ctx.font = '14px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('-', x + 80 + 15, y + 15);
    
    // 413b3039343540
    const sliderX = x + 120;
    this.renderSlider(ctx, sliderX, y, this.sliderWidth, 20, value);
    
    // Value text
    ctx.fillStyle = '#e0d5c1';
    ctx.font = '12px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(`${value}%`, sliderX + this.sliderWidth / 2, y + 15);
    
    // [+] button
    ctx.fillStyle = '#555';
    ctx.fillRect(x + 80 + this.sliderWidth + 30, y, 30, 20);
    ctx.fillStyle = '#fff';
    ctx.font = '14px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('+', x + 80 + this.sliderWidth + 45, y + 15);
    
    // Reset text align
    ctx.textAlign = 'left';
  }

  /**
   * 1e424038413e3230424c 413b3039343540
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
    ctx.fillStyle = '#444';
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
