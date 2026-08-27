/**
 * RenderOptimizer
 * 1e3f42383c38373046384f 40353d343540383d3330
 * 1a4d4838403e32303d3835 414230423847303c4b45 413b3e3532
 * @class RenderOptimizer
 */
export class RenderOptimizer {
  constructor(game) {
    this.game = game;
    this.ctx = game.ctx;
    
    // 1a4d48 41423042384735413a3845 413b3e3532
    this.staticElements = new Map();
    this.dirtyRegions = [];
    this.lastFrameTime = 0;
    this.frameCount = 0;
    
    // 1d304142403e393a30 3e3f423b30363a38
    this.init();
  }

  /**
   * 183d384638303b38373046384f
   * @private
   */
  init() {
    // 1d3542 413c4b413b30 414230423847303a3845 413b3e3532
    // 1d304142403e393a30 413b4348304230 343b4f 40353d343540383d3330
    window.addEventListener('resize', () => this.clearCache());
  }

  /**
   * 1e473841423a30 3a4d484230
   */
  clearCache() {
    this.staticElements.clear();
    this.dirtyRegions = [];
  }

  /**
   * 143e3130323b353d3835 3a 3a4d484335
   * @param {string} key - 1a3b4e47
   * @param {Function} renderFn - 24433d3a46384f 40353d34354030
   * @returns {CanvasRenderingContext2D}
   */
  createStaticCanvas(key, renderFn) {
    const canvas = document.createElement('canvas');
    canvas.width = this.game.width;
    canvas.height = this.game.height;
    const ctx = canvas.getContext('2d');
    
    renderFn(ctx);
    this.staticElements.set(key, { canvas, ctx });
    
    return ctx;
  }

  /**
   * 1f3e3b4347353d3835 413e4540303d353d3d3e333e 3a4d484130
   * @param {string} key
   * @returns {HTMLCanvasElement|null}
   */
  getStaticCanvas(key) {
    return this.staticElements.get(key)?.canvas || null;
  }

  /**
   * 1e424038413e3230424c 414230423847303c383c 413b3e38
   * @param {string} key
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  drawStaticElement(key, x, y, width, height) {
    const element = this.staticElements.get(key);
    if (element) {
      this.ctx.drawImage(element.canvas, x, y, width, height);
    }
  }

  /**
   * 1e42403c35474f424c 343b4f 413130423842303a30 40353d343540383d3330
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  addDirtyRegion(x, y, width, height) {
    this.dirtyRegions.push({ x, y, width, height });
  }

  /**
   * 1e424038413e3230424c 423e3b4c3a3e 343b4f 413f403042303b3d4b45 3e313b30414238
   */
  renderDirtyRegions() {
    if (this.dirtyRegions.length === 0) return;
    
    for (const region of this.dirtyRegions) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(region.x, region.y, region.width, region.height);
      this.ctx.clip();
      this.ctx.restore();
    }
    
    this.dirtyRegions = [];
  }

  /**
   * 1e3f42383c38373046384f 40353d343540383d3330
   * @param {Function} renderFn
   */
  optimizeRender(renderFn) {
    const startTime = performance.now();
    
    renderFn();
    
    const endTime = performance.now();
    this.lastFrameTime = endTime - startTime;
    this.frameCount++;
    
    // 1e4738414230423a30 4131304230324b45 403533383e3d3e32
    if (this.lastFrameTime > 16) { // > 60fps
      console.warn(`Frame took ${this.lastFrameTime.toFixed(2)}ms`);
    }
  }

  /**
   * 1f3e3b4347353d3835 3f403e463541413032 40353d343540383d3330
   * @returns {number}
   */
  getFps() {
    return this.frameCount / (this.lastFrameTime / 1000);
  }

  /**
   * 1f3e3b4347353d3835 42353a43493539 40353d34354030
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  isVisible(x, y, width, height) {
    return (
      x + width > 0 &&
      x < this.game.width &&
      y + height > 0 &&
      y < this.game.height
    );
  }

  /**
   * 1e424038413e3230424c 413f40303942 41 3e3f42383c38373046383539
   * @param {Object} entity
   * @returns {boolean}
   */
  shouldRender(entity) {
    if (!entity) return false;
    
    const margin = 100; // 1c30403630 32 100px 323e3a404333 4d3a403d30
    const camera = this.game.camera;
    
    if (!camera) return true;
    
    return (
      entity.x + entity.width + margin > camera.x &&
      entity.x - margin < camera.x + this.game.width &&
      entity.y + entity.height + margin > camera.y &&
      entity.y - margin < camera.y + this.game.height
    );
  }
}
