import { Game } from './core/Game.js';
import { Player } from './entities/Player.js';
import { Camera } from './systems/Camera.js';
import { MapGenerator } from './systems/MapGenerator.js';
import { HUD } from './ui/HUD.js';
import { EnemyManager } from './systems/EnemyManager.js';
import { CombatSystem } from './systems/CombatSystem.js';
import { ParticleSystem } from './systems/ParticleSystem.js';

// Инициализация игры
const game = new Game();
const player = new Player(game);
const camera = new Camera(game);
const mapGenerator = new MapGenerator(100, 100);
const hud = new HUD(game, player);
const enemyManager = new EnemyManager(game, player);
const combatSystem = new CombatSystem(game, player, enemyManager);
const particleSystem = new ParticleSystem(game);

// Сохраняем ссылку на игрока для ParticleSystem
game.player = player;

// Генерация карты
const levelData = mapGenerator.generate(1);
enemyManager.spawnEnemiesForFloor(levelData.rooms, 1);

// Подписка на обновление
game.events.on('game:update', (deltaTime) => {
  camera.follow(player);
});

// Подписка на отрисовку
game.events.on('game:render', (ctx) => {
  camera.applyTransform(ctx);
  mapGenerator.render(ctx, camera);
  enemyManager.render(ctx);
  player.render(ctx);
  combatSystem.render(ctx);
  particleSystem.render(ctx);
  camera.resetTransform(ctx);
  
  hud.render(ctx);
});

// Запуск игры
game.start();

// Экспорт для отладки
window.game = game;
window.player = player;
window.camera = camera;
window.mapGenerator = mapGenerator;
window.levelData = levelData;
window.hud = hud;
window.enemyManager = enemyManager;
window.combatSystem = combatSystem;
window.particleSystem = particleSystem;

console.log('Dark Descent: Echoes of the Abyss - Game initialized');
