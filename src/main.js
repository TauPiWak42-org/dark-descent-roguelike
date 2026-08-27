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

// 133b3e31303b4c3d4b35 3f3540353c353d3d4b35
const settingsManager = new SettingsManager();

// 1d304142403e393a30 41384142353c4b 3730334043373a38
const loadingScreen = new LoadingScreen();

// 183d384638303b38373046384f 3833404b
const game = new Game();
const player = new Player(game);
const camera = new Camera(game);
const inputManager = new InputManager(game);
const mapGenerator = new MapGenerator(100, 100);
const hud = new HUD(game, player);
const enemyManager = new EnemyManager(game, player);
const combatSystem = new CombatSystem(game, player, enemyManager);
const particleSystem = new ParticleSystem(game);
const settingsUI = new SettingsUI(game, settingsManager);
const renderOptimizer = new RenderOptimizer(game);
const itemManager = new ItemManager(game, player);

// 1d304142403e393a30 343b4f 334030323b38
const levelData = mapGenerator.generate(1);
enemyManager.spawnEnemiesForFloor(levelData.rooms, 1);

// 1f3e3b30323b4f4230 3d304142403e393a303c 3837 SettingsManager
const settings = settingsManager.getSettings();
if (settings.debugMode) {
  game.debugMode = true;
}

// 213e4540303d4f35 41414b3b3a43 3d30 38334042
game.player = player;
game.input = inputManager;
game.settings = settingsManager;
game.renderOptimizer = renderOptimizer;

// 21383c433b384043304230 3730334043373a38
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

// 1f3e343f38413a30 3d30 413e314b4242384f
game.events.on('game:update', (deltaTime) => {
  inputManager.update();
  camera.follow(player);
  itemManager.update(deltaTime);
});

// 1f3e343f38413a30 3d30 40353d343540383d3343
game.events.on('game:render', (ctx) => {
  // 1e424038413e323030 41 3e3f42383c38373046383539
  renderOptimizer.optimizeRender(() => {
    camera.applyTransform(ctx);
    mapGenerator.render(ctx, camera);
    itemManager.render(ctx);
    enemyManager.render(ctx);
    player.render(ctx);
    combatSystem.render(ctx);
    particleSystem.render(ctx);
    camera.resetTransform(ctx);
    
    // 1e424038413e323030 UI
    hud.render(ctx);
    settingsUI.render(ctx);
  });
});

// 2d3a413f3e4042 343b4f 3e423b30343a38
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

console.log('Dark Descent: Echoes of the Abyss - Game initialized');
