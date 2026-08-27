/**
 * ItemManager
 * \u00041c\u000435\u00043d\u000435\u000434\u000436\u000435\u000440 \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442\u00043e\u000432
 * \u000423\u00043f\u000440\u000430\u000432\u00043b\u00044f\u000435\u000442 \u000441\u00043f\u000430\u000432\u00043d\u00043e\u00043c \u000438 \u000440\u000430\u000441\u00043f\u00043e\u00043b\u00043e\u000436\u000435\u00043d\u000438\u00044f \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442\u00043e\u000432
 * @class ItemManager
 */
export class ItemManager {
  constructor(game, player) {
    this.game = game;
    this.player = player;
    this.events = game.events;
    
    this.items = [];
    this.spawnTimer = 0;
    this.spawnInterval = 5; // \u000441\u000435\u00043a\u000443\u00043d\u000434\u00044b \u00043c\u000435\u000436\u000434\u000443 \u000441\u00043f\u000430\u000432\u00043d\u000430\u00043c
    
    this.setupEvents();
  }

  /**
   * \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u000441\u00043e\u000431\u00044b\u000442\u000438\u000439
   * @private
   */
  setupEvents() {
    this.events.on('game:update', (deltaTime) => this.update(deltaTime));
    this.events.on('game:render', (ctx) => this.render(ctx));
    this.events.on('enemy:died', (data) => this.onEnemyDied(data));
  }

  /**
   * \u000421\u00043f\u000430\u000432\u00043d \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442\u000430
   * @param {number} x
   * @param {number} y
   * @param {string} type
   * @returns {Item}
   */
  spawnItem(x, y, type) {
    // \u000418\u00043c\u00043f\u00043e\u000440\u000442\u000438\u000440\u000443\u000435\u00043c \u000438\u000437 \u000433\u00043b\u00043e\u000431\u000430\u00043b\u00044c\u00043d\u00043e\u000433\u00043e \u00043e\u000431\u00044a\u000435\u00043a\u000442\u000430
    // \u00041d\u000435 \u000438\u000441\u00043f\u00043e\u00043b\u00044c\u000437\u000443\u000435\u00043c async/await - \u000431\u00043b\u00043e\u00043a\u000438\u000440\u000443\u000435\u000442 \u000438\u000433\u000440\u00043e\u000432\u00043e\u000439 \u000446\u000438\u00043a\u00043b
    const { Item } = require('../entities/Item.js');
    const item = new Item(this.game, x, y, type);
    this.items.push(item);
    return item;
  }

  /**
   * \u000421\u00043f\u000430\u000432\u00043d \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442\u000430 \u000432 \u000441\u00043b\u000443\u000447\u000430\u000439\u00043d\u00043e\u00043c \u00043c\u000435\u000441\u000442\u000435
   * @param {Object} data
   * @private
   */
  onEnemyDied(data) {
    const { enemy } = data;
    
    // 20% \u000448\u000430\u00043d\u000441 \u000441\u00043f\u000430\u000432\u000430 \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442\u000430
    if (Math.random() < 0.2) {
      const types = ['potion', 'healing_potion', 'artifact', 'staff', 'wand', 'scroll', 'gem'];
      const type = types[Math.floor(Math.random() * types.length)];
      this.spawnItem(enemy.x, enemy.y, type);
    }
  }

  /**
   * \u00041e\u000431\u00043d\u00043e\u000432\u00043b\u000435\u00043d\u000438\u000435 \u000430\u000432\u000442\u00043e\u00043c\u000430\u000442\u000438\u000447\u000430
   * @param {number} deltaTime
   */
  update(deltaTime) {
    this.spawnTimer += deltaTime;
    
    // \u00041f\u000435\u000440\u000438\u00043e\u000434\u000438\u000447\u000435\u00043d\u000438\u000435 \u000441\u00043f\u000430\u000432\u00043d \u00043d\u00043e\u000432\u00044b\u000445 \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442\u00043e\u000432
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      const types = ['potion', 'healing_potion', 'gem'];
      const type = types[Math.floor(Math.random() * types.length)];
      const x = Math.random() * (this.game.width - 40) + 20;
      const y = Math.random() * (this.game.height - 40) + 20;
      this.spawnItem(x, y, type);
    }
    
    for (const item of this.items) {
      item.update(deltaTime);
      
      // \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u000441\u000431\u00043e\u000440\u000430\u000441\u000442\u000430 \u000441 \u000438\u000433\u000440\u00043e\u00043a\u00043e\u00043c
      if (this.checkCollision(item, this.player) && !item.isCollected) {
        item.collect(this.player);
      }
    }
    
    // \u000423\u000434\u000430\u00043b\u000435\u00043d\u000438\u000435 \u000441\u00043e\u000431\u000440\u000430\u00043d\u00043d\u00044b\u000435 \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442\u000430\u000442
    this.items = this.items.filter(item => !item.isCollected || item.collectTimer > 0);
  }

  /**
   * \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u000441\u000432\u00043e\u00043b\u000441\u000442\u000432\u000430
   * @param {Object} item
   * @param {Object} target
   * @returns {boolean}
   * @private
   */
  checkCollision(item, target) {
    return (
      item.x < target.x + target.width &&
      item.x + item.width > target.x &&
      item.y < target.y + target.height &&
      item.y + item.height > target.y
    );
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u000430\u000442\u00044c \u00043f\u000440\u000435\u000434\u00043c\u000435\u000442\u00043e\u000432
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    for (const item of this.items) {
      item.render(ctx);
    }
  }

  /**
   * \u00041e\u000447\u000438\u000441\u000442\u00043a\u000430 \u000441\u00043f\u000438\u000441\u00043a\u000430 36\u000435\u00043b\u00043e\u000432
   */
  clear() {
    this.items = [];
  }
}
