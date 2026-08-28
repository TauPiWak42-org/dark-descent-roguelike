/**
 * \u00041d\u000430\u000431\u000435\u00043d\u00044c \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442\u000430\u00043c\u000438
 * \u00041e\u000442\u000432\u000435\u000447\u000430\u000435\u000442 \u000437\u000430 \u000441\u00043f\u000430\u000432\u000430\u000432\u00044b \u000438 \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442\u000430\u00043c\u000438
 * \u000426\u000432\u000435\u000442\u000430\u00044f \u00043f\u000430\u00043b\u000438\u000442\u00043e\u000432: #1a1a2e, #16213e, #1f1f2e
 * \u000417\u00043e\u00043b\u00043e\u000442\u000430: #d4af37, #ffd700, #8b6914
 * \u00041d\u000435\u00043b\u000435\u00043d\u000442\u00044b: \u00043e\u000433\u00043e\u00043d\u00044c #ff6b35, \u00043b\u000451\u000434 #7ec8e3, \u00044f\u000434 #7cb342, \u00043a\u000440\u00043e\u000432\u00044c #8b0000, \u000434\u000443\u000448\u000438 #9b59b6
 * \u000426\u000432\u000435\u000442\u000430\u000432\u00044b \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442\u000430\u000432\u000430: \u000434\u000435\u000430\u00043b\u00044c #d4af37, \u00043b\u000435\u000447\u000435\u00043d\u00044c #7ec8e3, \u000430\u000440\u000442\u000435\u000444\u000430\u00043a\u000442\u00044b #2196f3, \u000441\u000442\u000430\u000444\u00044b #ffd700, \u000441\u000432\u000440\u000442\u00044b\u00044b #9b59b6, \u00043a\u00043b\u00044e\u000447\u00044b #ff6b35, \u000441\u000435\u00043c\u00044b\u00044b #00bcd4
 * @class ItemManager
 */
export class ItemManager {
  constructor(game, player) {
    this.game = game;
    this.player = player;
    this.events = game.events;
    this.items = [];
    this.maxItems = 50;
    this.spawnTimer = 0;
    this.spawnInterval = 5; // seconds
    
    this.itemTypes = [
      { type: 'health_potion', name: 'Health Potion', color: '#4caf50', effect: 'heal', value: 25, weight: 30 },
      { type: 'mana_potion', name: 'Mana Potion', color: '#7ec8e3', effect: 'mana', value: 20, weight: 25 },
      { type: 'artifact', name: 'Artifact', color: '#2196f3', effect: 'artifact', value: 1, weight: 10 },
      { type: 'staff', name: 'Staff', color: '#ffd700', effect: 'staff', value: 1, weight: 10 },
      { type: 'wand', name: 'Wand', color: '#ffd700', effect: 'wand', value: 1, weight: 10 },
      { type: 'scroll', name: 'Scroll', color: '#9b59b6', effect: 'scroll', value: 1, weight: 10 },
      { type: 'key', name: 'Key', color: '#ff6b35', effect: 'key', value: 1, weight: 5 },
      { type: 'gem', name: 'Gem', color: '#00bcd4', effect: 'gem', value: 1, weight: 5 }
    ];
    
    this.setupEvents();
  }

  /**
   * \u00041e\u000447\u000438\u000441\u000442\u00043a\u000430 \u000441\u00043b\u000443\u000448\u000430\u000442\u000435\u00043b\u000435\u000439
   */
  cleanup() {
    for (const unsubscribe of this.unsubscribers || []) {
      unsubscribe();
    }
    this.unsubscribers = [];
    this.items = [];
  }

  /**
   * \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u000441\u00043e\u000431\u00044b\u000442\u000438\u000439
   * @private
   */
  setupEvents() {
    this.unsubscribers = [];
    const unsubscribeUpdate = this.events.on('game:update', (deltaTime) => this.update(deltaTime));
    const unsubscribeRender = this.events.on('game:render', (ctx) => this.render(ctx));
    this.unsubscribers.push(unsubscribeUpdate, unsubscribeRender);
  }

  /**
   * \u00041e\u000431\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u000441\u00043e\u000441\u000442\u00043e\u000439\u00043d\u000438\u00044f
   * @param {number} deltaTime
   */
  update(deltaTime) {
    this.spawnTimer += deltaTime;
    
    // \u000421\u00043f\u000430\u000432\u00043d\u00043e\u000432 \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442\u000430\u00043c
    if (this.spawnTimer >= this.spawnInterval && this.items.length < this.maxItems) {
      this.spawnTimer = 0;
      this.spawnRandomItem();
    }
    
    // \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u00043a\u00043e\u00043b\u00043b\u000438\u000437\u000438\u00044f \u000441 \u000438\u000433\u000440\u00043e\u00043a\u00043e\u00043c
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      
      // \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u00043a\u00043e\u00043b\u00043b\u000438\u000437\u000438\u00044f
      if (this.checkCollision(item)) {
        this.pickupItem(i);
      }
    }
  }

  /**
   * \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u00043a\u00043e\u00043b\u00043b\u000438\u000437\u000438\u00044f \u000441 \u000438\u000433\u000440\u00043e\u00043a\u00043e\u00043c
   * @param {Object} item
   * @returns {boolean}
   * @private
   */
  checkCollision(item) {
    if (!this.player || !this.player.isAlive) return false;
    
    const dx = this.player.x + this.player.width / 2 - (item.x + item.width / 2);
    const dy = this.player.y + this.player.height / 2 - (item.y + item.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < (this.player.width + item.width) / 2;
  }

  /**
   * \u00041f\u00043e\u000434\u000431\u00043e\u000442\u00044c \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442
   * @param {number} index
   * @private
   */
  pickupItem(index) {
    const item = this.items[index];
    
    // \u00041f\u000440\u000438\u00043c\u000435\u00043d\u000438\u000435 \u00044d\u000444\u000435\u00043a\u000442\u000430
    this.applyItemEffect(item);
    
    // \u000423\u000434\u000430\u00043b\u000438\u000442\u00044c \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442
    this.items.splice(index, 1);
    
    this.events.emit('item:picked', { item });
    
    // \u00041d\u000430\u000434\u00043f\u00043e\u00043b\u00043d\u00043e\u000441\u000442\u000438 \u000432 \u000441\u000431\u000438\u000441\u00043a\u000430\u000432
    if (item.type === 'gold' || item.type === 'soul') {
      this.events.emit('effect:gold', { x: item.x + item.width/2, y: item.y + item.height/2, amount: item.value });
    }
  }

  /**
   * \u00041f\u000440\u000438\u00043c\u000435\u00043d\u000438\u000442\u00044c \u00044d\u000444\u000444\u000435\u00043a\u000442\u000430 \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442\u000430\u00043c
   * @param {Object} item
   * @private
   */
  applyItemEffect(item) {
    if (!this.player) return;
    
    switch (item.type) {
      case 'health_potion':
        this.player.heal(item.value);
        break;
      case 'mana_potion':
        this.player.restoreMana(item.value);
        break;
      case 'gold':
        this.player.addGold(item.value);
        break;
      case 'soul':
        this.player.addSouls(item.value);
        break;
      case 'artifact':
        // \u00041d\u000430\u00043d\u000430 \u00043d\u000430 \u000430\u000435\u000440\u000435\u000434\u000435\u00043d\u000438\u000442\u000441\u000442\u000438\u00044f
        this.player.maxHealth += 10;
        this.player.health += 10;
        this.events.emit('player:healed', { amount: 10, health: this.player.health });
        break;
      case 'staff':
        // \u00041d\u000430\u00043d\u000430 \u000441\u000442\u000430\u000444
        this.player.damage += 5;
        break;
      case 'wand':
        // \u00041d\u000430\u00043d\u000430 \u000442\u00043e\u000447\u00043a\u000430\u000439
        this.player.maxMana += 10;
        this.player.mana += 10;
        this.events.emit('player:mana', { mana: this.player.mana });
        break;
      case 'scroll':
        // \u000421\u000432\u000435\u000446\u000438\u000444\u000430\u000442\u000442\u000430\u000442\u000430\u000432
        this.player.xp += 10;
        break;
      case 'key':
        // \u00041a\u00043b\u00044e\u000447
        this.player.keys = (this.player.keys || 0) + 1;
        break;
      case 'gem':
        // \u000414\u000440\u000430\u000437\u00043d\u000430\u000440\u00044b\u00043b
        this.player.addGold(item.value * 10);
        break;
    }
  }

  /**
   * \u000421\u00043f\u000430\u000432\u00043d\u000438\u000446\u000441\u00044b \u000441\u00043b\u000443\u000447\u000430\u000439\u00043d\u00043e \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442
   * @private
   */
  spawnRandomItem() {
    if (this.items.length >= this.maxItems) return;
    
    // \u000412\u000441\u00043a\u00043b\u000430\u00043d\u000438\u000440\u00044b \u000442\u000438\u00043f
    const totalWeight = this.itemTypes.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedType = null;
    
    for (const itemType of this.itemTypes) {
      random -= itemType.weight;
      if (random <= 0) {
        selectedType = itemType;
        break;
      }
    }
    
    if (!selectedType) return;
    
    // \u00041f\u00043e\u000437\u000438\u000446\u000438\u00044f
    const camera = this.game.camera || { x: 0, y: 0 };
    const x = camera.x + Math.random() * this.game.width * 0.8 + this.game.width * 0.1;
    const y = camera.y + Math.random() * this.game.height * 0.8 + this.game.height * 0.1;
    
    // \u00041d\u000435 \u000432 \u000441\u000442\u000435\u00043d\u000430\u000445
    if (this.game.mapGenerator && this.game.mapGenerator.map) {
      const tileX = Math.floor(x / this.game.mapGenerator.tileSize);
      const tileY = Math.floor(y / this.game.mapGenerator.tileSize);
      
      if (tileX >= 0 && tileX < this.game.mapGenerator.width &&
          tileY >= 0 && tileY < this.game.mapGenerator.height &&
          this.game.mapGenerator.map[tileY][tileX] === 1) {
        return; // \u00041d\u000435 \u000441\u00043f\u000430\u000432\u00043d\u000438\u000442\u00044c \u000432 \u000441\u000442\u000435\u00043d\u000435
      }
    }
    
    this.items.push({
      x: x,
      y: y,
      width: 20,
      height: 20,
      ...selectedType,
      id: Date.now() + Math.random()
    });
  }

  /**
   * \u000421\u00043f\u000430\u000432\u00043d\u000438\u000446\u000438\u00044f \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    ctx.save();
    
    for (const item of this.items) {
      this.renderItem(ctx, item);
    }
    
    ctx.restore();
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} item
   * @private
   */
  renderItem(ctx, item) {
    // \u00041e\u000441\u00043d\u00043e\u000432\u00043d\u000430\u00044f \u000441\u00043e\u000431\u000441\u000430\u000442\u000430\u000432
    ctx.fillStyle = 'rgba(26, 26, 46, 0.8)';
    ctx.fillRect(item.x, item.y, item.width, item.height);
    
    // \u000413\u000440\u000430\u00043d\u000438\u000446\u000430
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.strokeRect(item.x, item.y, item.width, item.height);
    
    // \u000417\u00043e\u00043b\u00043e\u000442\u000430\u00044f \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442\u000430
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(item.x + item.width / 2, item.y + item.height / 2, item.width / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    // \u000421\u000432\u000435\u000446\u000442\u000430\u00044b \u000437\u00043e\u00043b\u00043e\u000442\u000430\u00044b \u000441\u000432\u000435\u000442\u000430\u000442\u000430
    ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.beginPath();
    ctx.arc(item.x + item.width / 2, item.y + item.height / 2, item.width / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // \u00041d\u000430\u000434\u00043f\u000438\u000441\u00044c
    ctx.fillStyle = '#e0d5c1';
    ctx.font = '8px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(item.name.substring(0, 3), item.x + item.width / 2, item.y + item.height / 2 + 3);
    ctx.textAlign = 'left';
  }

  /**
   * \u000421\u00043f\u000430\u000432\u00043d\u000438\u000446\u000441\u00044b \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442 \u000432 \u000441\u00043f\u000435\u000446\u000438\u000430\u00043b\u00044c\u00043d\u00043e\u00043c\u000442\u000438
   * @param {number} x
   * @param {number} y
   * @param {string} type
   */
  spawnItemAt(x, y, type) {
    const itemType = this.itemTypes.find(it => it.type === type);
    if (!itemType) return;
    
    this.items.push({
      x: x,
      y: y,
      width: 20,
      height: 20,
      ...itemType,
      id: Date.now() + Math.random()
    });
  }
}
