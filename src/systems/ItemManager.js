/**
 * ItemManager
 * 1c353d3534363540 3f4035343c35423e32
 * 233f4030323b4f3542 413f30323d4b3c 38 4030413f3b3e36353d3835 3f4035343c35423e32
 * @class ItemManager
 */
export class ItemManager {
  constructor(game, player) {
    this.game = game;
    this.player = player;
    this.events = game.events;
    
    this.items = [];
    this.spawnTimer = 0;
    this.spawnInterval = 5; // 41353a433d344b 3c35363443 413f30323d303c
    
    this.setupEvents();
  }

  /**
   * 1d304142403e393a30 413e314b423839
   * @private
   */
  setupEvents() {
    this.events.on('game:update', (deltaTime) => this.update(deltaTime));
    this.events.on('game:render', (ctx) => this.render(ctx));
    this.events.on('enemy:died', (data) => this.onEnemyDied(data));
  }

  /**
   * 213f30323d 3f4035343c3542
   * @param {number} x
   * @param {number} y
   * @param {string} type
   * @returns {Item}
   */
  async spawnItem(x, y, type) {
    const { Item } = await import('../entities/Item.js');
    const item = new Item(this.game, x, y, type);
    this.items.push(item);
    return item;
  }

  /**
   * 213f30323d 3f4035343c354230 32 413b434730393d3e3c 3c35414235
   * @param {Object} data
   * @private
   */
  async onEnemyDied(data) {
    const { enemy } = data;
    
    // 20% 48303d41 413f303230 3f4035343c354230
    if (Math.random() < 0.2) {
      const types = ['potion', 'healing_potion', 'artifact', 'staff', 'wand', 'scroll', 'gem'];
      const type = types[Math.floor(Math.random() * types.length)];
      await this.spawnItem(enemy.x, enemy.y, type);
    }
  }

  /**
   * 1e313d3e323b353d3835 303242303c3042384730
   * @param {number} deltaTime
   */
  async update(deltaTime) {
    this.spawnTimer += deltaTime;
    
    // 1f3540383e343847353d3835 413f30323d 3d3e324b45 3f4035343c35423e32
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      const types = ['potion', 'healing_potion', 'gem'];
      const type = types[Math.floor(Math.random() * types.length)];
      const x = Math.random() * (this.game.width - 40) + 20;
      const y = Math.random() * (this.game.height - 40) + 20;
      await this.spawnItem(x, y, type);
    }
    
    for (const item of this.items) {
      item.update(deltaTime);
      
      // 1f403e3235403a30 41313e403041423230 41 3833403a3e3c
      if (this.checkCollision(item, this.player) && !item.isCollected) {
        item.collect(this.player);
      }
    }
    
    // 2334303b353d3835 413e3140303d3d4b35 3f4035343c35423042
    this.items = this.items.filter(item => !item.isCollected || item.collectTimer > 0);
  }

  /**
   * 1f403e3235403a30 41323e3b414232353d384f
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
   * 1e424038413e323030 3f4035343c35423e32
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    for (const item of this.items) {
      item.render(ctx);
    }
  }

  /**
   * 1e473841423a30 413f38413a30 36353b3e32
   */
  clear() {
    this.items = [];
  }
}
