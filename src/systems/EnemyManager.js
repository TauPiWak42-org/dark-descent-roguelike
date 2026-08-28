import { Enemy } from '../entities/Enemy.js';

/**
 * Менеджер врагов
 * Управляет созданием, обновлением и отрисовкой врагов
 * @class EnemyManager
 */
export class EnemyManager {
  constructor(game, player) {
    this.game = game;
    this.player = player;
    this.events = game.events;
    
    this.enemies = [];
    
    this.setupEvents();
  }

  /**
   * Настройка событий
   * @private
   */
  setupEvents() {
    this.events.on('game:update', (deltaTime) => this.update(deltaTime));
    this.events.on('game:render', (ctx) => this.render(ctx));
    this.events.on('enemy:died', (data) => this.onEnemyDied(data));
  }

  /**
   * Создание врага
   * @param {number} x - Позиция X
   * @param {number} y - Позиция Y
   * @param {string} type - Тип врага
   * @returns {Enemy} Созданный враг
   */
  spawnEnemy(x, y, type) {
    const enemy = new Enemy(this.game, x, y, type);
    enemy.setTarget(this.player);
    this.enemies.push(enemy);
    return enemy;
  }

  /**
   * Создание врагов для этажа
   * @param {Array} rooms - Список комнат
   * @param {number} floor - Номер этажа
   */
  spawnEnemiesForFloor(rooms, floor) {
    const enemyCount = 5 + floor * 2;
    
    for (let i = 0; i < enemyCount; i++) {
      const room = rooms[Math.floor(Math.random() * rooms.length)];
      const x = (room.x + 1 + Math.random() * (room.width - 2)) * 32;
      const y = (room.y + 1 + Math.random() * (room.height - 2)) * 32;
      
      // Выбор типа врага
      const type = this.getEnemyTypeForFloor(floor);
      this.spawnEnemy(x, y, type);
    }
  }

  /**
   * Выбор типа врага для этажа
   * @param {number} floor - Номер этажа
   * @returns {string} Тип врага
   * @private
   */
  getEnemyTypeForFloor(floor) {
    const random = Math.random();
    
    if (floor >= 5 && random < 0.2) return 'demon';
    if (floor >= 3 && random < 0.5) return 'zombie';
    if (floor >= 7 && random < 0.1) return 'ghost';
    
    return 'skeleton';
  }

  /**
   * Обработка смерти врага
   * @param {Object} data - Данные о смерти
   * @private
   */
  onEnemyDied(data) {
    const { enemy } = data;
    
    // Удаление из списка (награда уже выдана в Enemy.die())
    // Награда уже выдана в Enemy.die(), здесь только удаление из списка и очистка
    const index = this.enemies.indexOf(enemy);
    if (index > -1) {
      this.enemies.splice(index, 1);
    }
    
    // Очистка подписок врага
    if (enemy.cleanup) {
      enemy.cleanup();
    }
  }

  /**
   * Обновление всех врагов
   * @param {number} deltaTime - Время с прошлого кадра
   */
  update(deltaTime) {
    this.enemies.forEach(enemy => enemy.update(deltaTime));
  }

  /**
   * Отрисовка всех врагов
   * @param {CanvasRenderingContext2D} ctx - Контекст canvas
   */
  render(ctx) {
    this.enemies.forEach(enemy => enemy.render(ctx));
  }

  /**
   * Получение списка живых врагов
   * @returns {Array} Живые враги
   */
  getAliveEnemies() {
    return this.enemies.filter(enemy => enemy.isAlive);
  }

  /**
   * Очистка всех врагов
   */
  clear() {
    this.enemies = [];
  }
}
