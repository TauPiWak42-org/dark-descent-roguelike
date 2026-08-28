import { Game } from './core/Game.js';
import { Player } from './entities/Player.js';
import { Camera } from './systems/Camera.js';
import { MapGenerator } from './systems/MapGenerator.js';
import { HUD } from './ui/HUD.js';
import { EnemyManager } from './systems/EnemyManager.js';
import { CombatSystem } from './systems/CombatSystem.js';
import { ParticleSystem } from './systems/ParticleSystem.js';
import { SettingsManager } from './core/SettingsManager.js';
import { SettingsUI } from './ui/SettingsUI.js';
import { InputManager } from './core/InputManager.js';
import { LoadingScreen } from './ui/LoadingScreen.js';
import { RenderOptimizer } from './core/RenderOptimizer.js';
import { ItemManager } from './systems/ItemManager.js';

// \u000413\u00043b\u00043e\u000431\u000430\u00043b\u00044c\u00043d\u00044b\u000435 \u00043f\u000435\u000440\u000435\u00043c\u000435\u00043d\u00043d\u00044b\u000435
const settingsManager = new SettingsManager();

// \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u000441\u000438\u000441\u000442\u000435\u00043c\u00044b \u000437\u000430\u000433\u000440\u000443\u000437\u00043a\u000438
const loadingScreen = new LoadingScreen();

// \u000418\u00043d\u000438\u000446\u000438\u000430\u00043b\u000438\u000437\u000430\u000446\u000438\u00044f \u000438\u000433\u000440\u00044b
const game = new Game();
const player = new Player(game);
const camera = new Camera(game);
const inputManager = new InputManager(game);
const mapGenerator = new MapGenerator(100, 100);
const hud = new HUD(game, player);
const enemyManager = new EnemyManager(game, player);
const combatSystem = new CombatSystem(game, player, enemyManager);
const particleSystem = new ParticleSystem(game);
game.combatSystem = combatSystem;
const settingsUI = new SettingsUI(game, settingsManager);
const renderOptimizer = new RenderOptimizer(game);
const itemManager = new ItemManager(game, player);

// \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u000434\u00043b\u00044f \u000433\u000440\u000430\u000432\u000443\u000437\u00043a\u000438
const levelData = mapGenerator.generate(1);

// TOPDOWN: \u00041f\u00043b\u000430\u000442\u000435\u000440\u00044c \u000441\u00043f\u000430\u000432\u00043d\u000438\u000442\u000441\u00044f \u000432 \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u000435
player.x = levelData.playerStartX || 400;
player.y = levelData.playerStartY || 300;

// TOPDOWN: \u00041f\u00043e\u000440\u000438\u000434\u00043e\u000440\u000430\u000434 \u000442\u00043e\u00043b\u00044c\u00043a\u00043e \u00043a\u000430\u00043c\u000435\u000440\u000430 \u00043d\u000430 \u000441\u00043b\u000435\u000434\u000438\u000442\u000441\u00044c \u000437\u000430 \u000438\u000433\u000440\u00043e\u00043a\u000430
camera.x = player.x - game.width / 2 + player.width / 2;
camera.y = player.y - game.height / 2 + player.height / 2;

enemyManager.spawnEnemiesForFloor(levelData.rooms, 1);

// \u00041f\u00043e\u00043b\u000430\u000432\u00043b\u00044f\u000442\u000430 \u00043d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430\u00043c \u000438\u000437 SettingsManager
const settings = settingsManager.getSettings();
if (settings.debugMode) {
  game.debugMode = true;
}

// \u000421\u00043e\u000445\u000440\u000430\u00043d\u00044f\u000442\u00044c \u000441\u000441\u00044b\u00043b\u00043a\u000443 \u00043d\u000430 \u000438\u000433\u000440\u00043e\u00043a\u000442
game.player = player;
game.camera = camera;
game.input = inputManager;
game.settings = settingsManager;
game.renderOptimizer = renderOptimizer;

// \u000421\u000438\u00043c\u000443\u00043b\u000438\u000440\u000443\u000430\u000442\u000430 \u000437\u000430\u000433\u000440\u000443\u000437\u00043a\u000438
setTimeout(() => {
  loadingScreen.updateProgress(20);
}, 100);

setTimeout(() => {
  loadingScreen.updateProgress(40);
}, 200);

setTimeout(() => {
  loadingScreen.updateProgress(60);
}, 300);

setTimeout(() => {
  loadingScreen.updateProgress(80);
}, 400);

setTimeout(() => {
  loadingScreen.updateProgress(100);
  loadingScreen.hide();
  game.start();
}, 500);

// \u00041f\u00043e\u000434\u00043f\u000438\u000441\u00043a\u000430 \u00043d\u000430 \u000441\u00043e\u000431\u00044b\u000442\u000438\u00044f
game.events.on('game:update', (deltaTime) => {
  inputManager.update();
  camera.follow(player);
  itemManager.update(deltaTime);
});

// Подписка на рендеринг
game.events.on('game:render', (ctx) => {
  // Отрисовка с оптимизацией
  renderOptimizer.optimizeRender(() => {
    camera.applyTransform(ctx);
    mapGenerator.render(ctx, camera);
    itemManager.render(ctx);
    enemyManager.render(ctx);
    player.render(ctx);
    combatSystem.render(ctx);
    particleSystem.render(ctx);
    camera.resetTransform(ctx);
    
    // Отрисовка UI
    hud.render(ctx);
    settingsUI.render(ctx);
  });
});

// \u00042d\u00043a\u000441\u00043f\u00043e\u000440\u000442 \u000434\u00043b\u00044f \u00043e\u000442\u00043b\u000430\u000434\u00043a\u000438
window.game = game;
window.player = player;
window.camera = camera;
window.mapGenerator = mapGenerator;
window.levelData = levelData;
window.hud = hud;
window.enemyManager = enemyManager;
window.combatSystem = combatSystem;
window.particleSystem = particleSystem;
window.settingsManager = settingsManager;
window.settingsUI = settingsUI;
window.renderOptimizer = renderOptimizer;
window.itemManager = itemManager;

// TOPDOWN game - this is a TOPDOWN format game where world is larger than viewport and camera follows player
console.log('Dark Descent: Echoes of the Abyss - Game initialized - TOPDOWN format');
