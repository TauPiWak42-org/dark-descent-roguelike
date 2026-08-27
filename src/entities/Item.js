/**
 * Item
 * 1130373e324b39 3a3b304141 3f4035343c35423e32
 * @class Item
 */
export class Item {
  /**
   * @param {Game} game - 11414b3b3a30 3d30 38334043
   * @param {number} x - 1f3e373846384f X
   * @param {number} y - 1f3e373846384f Y
   * @param {string} type - 22383f 3f4035343c354230
   */
  constructor(game, x, y, type = 'potion') {
    this.game = game;
    this.events = game.events;
    
    // 1f3e373846384f
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    
    // 22383f 38 41323e3941423230
    this.type = type;
    this.setupStats();
    
    // 213e41423e4f3d3835
    this.isCollected = false;
    this.collectTimer = 0;
    
    // 26323542 32 3730323841383c3e414238 3e42 42383f30 3f4035343c354230
    this.color = this.getTypeColor();
    
    // 1f403e4740473d3e41424c 343b4f 41313e4030
    this.glowColor = this.getGlowColor();
  }

  /**
   * 1f3e3b4347353d3835 4632354230 32 3730323841383c3e414238 3e42 42383f30 3f4035343c354230
   * @returns {string}
   * @private
   */
  getTypeColor() {
    const colors = {
      potion: '#4caf50',      // 17353b4c35 3b3547353d384f
      healing_potion: '#4caf50', // 17353b4c35 3b3547353d384f
      artifact: '#2196f3',    // 1040423544303a42
      staff: '#ffd700',       // 1635373b
      wand: '#ffd700',        // 1635373b
      scroll: '#9c27b0',      // 213238423e3a
      key: '#ff9800',         // 1a3b4e47
      gem: '#00bcd4'          // 144030333e46353d3d4b39 3a303c353d4c
    };
    return colors[this.type] || '#ffffff';
  }

  /**
   * 1f3e3b4347353d3835 4632354230 41323547353d384f
   * @returns {string}
   * @private
   */
  getGlowColor() {
    const colors = {
      potion: 'rgba(76, 175, 80, 0.5)',
      healing_potion: 'rgba(76, 175, 80, 0.5)',
      artifact: 'rgba(33, 150, 243, 0.5)',
      staff: 'rgba(255, 215, 0, 0.5)',
      wand: 'rgba(255, 215, 0, 0.5)',
      scroll: 'rgba(156, 39, 176, 0.5)',
      key: 'rgba(255, 152, 0, 0.5)',
      gem: 'rgba(0, 188, 212, 0.5)'
    };
    return colors[this.type] || 'rgba(255, 255, 255, 0.5)';
  }

  /**
   * 1d304142403e393a30 41423042384142383a
   * @private
   */
  setupStats() {
    const stats = {
      potion: { name: 'Potion', effect: 'heal', value: 25 },
      healing_potion: { name: 'Healing Potion', effect: 'heal', value: 50 },
      artifact: { name: 'Artifact', effect: 'boost', value: 10 },
      staff: { name: 'Staff', effect: 'damage_boost', value: 15 },
      wand: { name: 'Wand', effect: 'magic_boost', value: 20 },
      scroll: { name: 'Scroll', effect: 'random', value: 1 },
      key: { name: 'Key', effect: 'unlock', value: 1 },
      gem: { name: 'Gem', effect: 'gold_boost', value: 50 }
    };
    
    const s = stats[this.type] || stats.potion;
    Object.assign(this, s);
  }

  /**
   * 1f403e3235403a30 41313e4041423230 3d30 3833403e3a43
   * @param {Player} player
   */
  collect(player) {
    if (this.isCollected) return;
    
    this.isCollected = true;
    this.collectTimer = 0.5;
    
    // 1f40383c353d353d3835 4d4444353a4230
    this.applyEffect(player);
    
    this.events.emit('item:collected', { item: this, player });
  }

  /**
   * 1f40383c353d353d3835 4d4444353a4230
   * @param {Player} player
   * @private
   */
  applyEffect(player) {
    switch (this.effect) {
      case 'heal':
        player.heal(this.value);
        break;
      case 'boost':
        player.speed += this.value;
        break;
      case 'damage_boost':
        player.damage += this.value;
        break;
      case 'magic_boost':
        player.maxMana += this.value;
        player.mana = player.maxMana;
        break;
      case 'gold_boost':
        player.addGold(this.value);
        break;
      case 'unlock':
        // 1e423a404b424c 343235404c
        break;
      case 'random':
        // 213b434730393d4b39 4d4444353a42
        const randomEffect = ['heal', 'boost', 'damage_boost', 'magic_boost'][Math.floor(Math.random() * 4)];
        this.effect = randomEffect;
        this.applyEffect(player);
        break;
    }
  }

  /**
   * 1e313d3e323b353d3835 303242303c3042384730
   * @param {number} deltaTime
   */
  update(deltaTime) {
    if (this.isCollected) {
      this.collectTimer -= deltaTime;
      if (this.collectTimer <= 0) {
        this.isCollected = false;
      }
    }
  }

  /**
   * 1e424038413e323030 3f4035343c354230
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    if (this.isCollected && this.collectTimer > 0.3) return;
    
    const alpha = this.isCollected ? this.collectTimer * 3 : 1;
    
    // 21323547353d3835
    ctx.globalAlpha = alpha;
    
    // 1e413d3e323d304f 46323542
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 21323547353d3835 41 413235423b3e3c
    ctx.fillStyle = this.glowColor;
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 3, 0, Math.PI * 2);
    ctx.fill();
    
    // 123e414142303d3e323b353d3835 3340303d3846303b
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.globalAlpha = 1;
  }
}
