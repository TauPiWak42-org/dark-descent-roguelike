/**
 * Игровой цикл с фиксированным шагом обновления
 * Обеспечивает стабильную работу игры независимо от FPS
 * @class GameLoop
 */
export class GameLoop {
  /**
   * @param {Function} update - Функция обновления логики
   * @param {Function} render - Функция отрисовки
   * @param {number} fps - Целевой FPS
   */
  constructor(update, render, fps = 60) {
    this.update = update;
    this.render = render;
    this.fps = fps;
    this.frameTime = 1000 / fps;
    
    this.lastTime = 0;
    this.accumulator = 0;
    this.running = false;
    this.frameId = null;
    
    // Статистика
    this.fpsCounter = 0;
    this.fpsTimer = 0;
    this.currentFps = 0;
    this.averageFps = 0;
    this.frameCount = 0;
    
    this.boundLoop = this.loop.bind(this);
  }

  /**
   * Запуск игрового цикла
   */
  start() {
    if (this.running) return;
    
    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.frameId = requestAnimationFrame(this.boundLoop);
  }

  /**
   * Остановка игрового цикла
   */
  stop() {
    this.running = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  /**
   * Пауза игрового цикла
   */
  pause() {
    this.running = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  /**
   * Возобновление игрового цикла
   */
  resume() {
    if (!this.running) {
      this.start();
    }
  }

  /**
   * Главный цикл игры
   * @private
   * @param {number} currentTime - Текущее время
   */
  loop(currentTime) {
    if (!this.running) return;
    
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // Подсчёт FPS
    this.fpsTimer += deltaTime;
    this.fpsCounter++;
    this.frameCount++;
    
    if (this.fpsTimer >= 1000) {
      this.currentFps = this.fpsCounter;
      this.averageFps = Math.round(this.frameCount / (this.fpsTimer / 1000));
      this.fpsCounter = 0;
      this.fpsTimer = 0;
    }
    
    // Фиксированный шаг обновления
    this.accumulator += deltaTime;
    
    // Ограничение для предотвращения "спирали смерти"
    if (this.accumulator > 250) {
      this.accumulator = 250;
    }
    
    while (this.accumulator >= this.frameTime) {
      this.update(this.frameTime / 1000);
      this.accumulator -= this.frameTime;
    }
    
    // Отрисовка
    this.render();
    
    this.frameId = requestAnimationFrame(this.boundLoop);
  }

  /**
   * Получение текущего FPS
   * @returns {number} Текущий FPS
   */
  getFps() {
    return this.currentFps;
  }

  /**
   * Получение среднего FPS
   * @returns {number} Средний FPS
   */
  getAverageFps() {
    return this.averageFps;
  }
}
