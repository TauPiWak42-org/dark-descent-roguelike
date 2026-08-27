/**
 * InputManager
 * \u000423\u00043f\u000440\u000430\u000432\u00043b\u00044f\u000435\u000442 \u000432\u000432\u00043e\u000434\u00043e\u00043c \u00043f\u00043e\u00043b\u00044c\u000437\u00043e\u000432\u000430\u000442\u000435\u00043b\u00044f\u000435\u00043c
 * TOPDOWN game - all movement is relative to camera view
 * @class InputManager
 */
export class InputManager {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    
    // \u00041c\u00044b\u000448\u00044c
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;
    this.mousePressed = false;
    this.mouseReleased = false;
    this.prevMouseDown = false;
    
    // \u00041a\u00043b\u000430\u000432\u000438\u000448\u000430\u000443\u000440\u00044b
    this.keys = {};
    this.keysPressed = {};
    this.keysReleased = {};
    this.prevKeys = {};
    
    this.setupEventListeners();
  }

  /**
   * \u00041e\u000447\u000438\u000441\u000442\u00043a\u000430 \u000441\u00043b\u000443\u000448\u000430\u000442\u000435\u00043b\u000435\u000439
   */
  cleanup() {
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mousedown', this.handleMouseDown);
      this.canvas.removeEventListener('mouseup', this.handleMouseUp);
      this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    }
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  /**
   * \u00041d\u000430\u000441\u000442\u000440\u00043e\u000439\u00043a\u000430 \u000441\u00043b\u000443\u000448\u000430\u000442\u000435\u00043b\u000435\u000439
   * @private
   */
  setupEventListeners() {
    // \u00041c\u00044b\u000448\u00044c \u000434\u000432\u000438\u000436\u000435\u00043d\u000438\u00044f
    this.handleMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    };
    
    this.handleMouseDown = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      this.mouseDown = true;
    };
    
    this.handleMouseUp = (e) => {
      this.mouseDown = false;
      this.mouseReleased = true;
    };
    
    this.handleMouseLeave = () => {
      this.mouseDown = false;
    };
    
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
    
    // \u00041a\u00043b\u000430\u000432\u000438\u000448\u000430\u000443\u000440\u00044b
    this.handleKeyDown = (e) => {
      this.keys[e.key] = true;
      this.keysPressed[e.key] = true;
    };
    
    this.handleKeyUp = (e) => {
      this.keys[e.key] = false;
      this.keysReleased[e.key] = true;
    };
    
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  /**
   * \u000421\u000431\u000440\u00043e\u000441 \u000432\u000441\u000435\u000445 \u000441\u00043e\u000431\u000442\u00043e\u000439\u000439 \u000432\u000432\u00043e\u000434\u000430
   */
  update() {
    // \u00041f\u000440\u00043e\u000432\u000435\u000440\u00044f\u000435\u00043c \u00043e\u000434\u00043d\u00043e\u00043a\u000440\u000430\u000442\u00043d\u00043e\u000433\u00043e \u00043d\u000430\u000436\u000430\u000442\u000438\u00044f \u00043d\u000430 \u00043c\u00044b\u000448\u000438
    this.mousePressed = this.mouseDown && !this.prevMouseDown;
    this.prevMouseDown = this.mouseDown;
    
    // \u000421\u000431\u000440\u00043e\u000441 \u00043a\u00043b\u000430\u000432\u000438\u000448
    this.mouseReleased = false;
    this.keysPressed = {};
    this.keysReleased = {};
    
    // \u000421\u00043e\u000445\u000440\u000430\u00043d\u000435\u00043d\u000438\u000435 \u000441\u00043e\u000441\u000442\u00043e\u00044f\u00043d\u000438\u00044f \u00043f\u000440\u000435\u000434\u00044b\u000434\u000443\u000449\u000435\u000433\u00043e \u00043a\u00043b\u00044e\u000447\u000430
    this.prevKeys = { ...this.keys };
  }

  /**
   * \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u00043d\u000430\u000436\u000430\u000442\u000430\u000440 \u00043a\u00043b\u000430\u000432\u000438\u000448\u000430
   * @param {string} key
   * @returns {boolean}
   */
  isKeyPressed(key) {
    return this.keysPressed[key] || false;
  }

  /**
   * \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u00043e\u000442\u00043f\u000443\u000449\u000435\u00043d\u000430 \u00043a\u00043b\u000430\u000432\u000438\u000448\u000430
   * @param {string} key
   * @returns {boolean}
   */
  isKeyReleased(key) {
    return this.keysReleased[key] || false;
  }

  /**
   * \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u000437\u000430\u000436\u000430\u000442\u000430 \u00043a\u00043b\u000430\u000432\u000438\u000448\u000430
   * @param {string} key
   * @returns {boolean}
   */
  isKeyDown(key) {
    return this.keys[key] || false;
  }

  /**
   * \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u000441\u00043b\u000430\u000436\u000430\u000442\u000430\u000440 \u00043c\u00044b\u000448\u000438
   * @returns {boolean}
   */
  isMousePressed() {
    return this.mousePressed;
  }

  /**
   * \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u00043e\u000442\u00043f\u000443\u000449\u000435\u00043d\u000430 \u00043c\u00044b\u000448\u000438
   * @returns {boolean}
   */
  isMouseReleased() {
    return this.mouseReleased;
  }

  /**
   * \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u000437\u000430\u000436\u000430\u000442\u000430 \u00043c\u00044b\u000448\u000438 \u000437\u000430\u000440\u000430\u000442\u000430
   * @returns {boolean}
   */
  isMouseDown() {
    return this.mouseDown;
  }

  /**
   * \u00041f\u00043e\u00043b\u000447\u000447\u000430\u000442\u00044c \u00043a\u00043e\u00043e\u000440\u000434\u000438\u00043d\u000430\u000442\u00044b \u00043c\u00044b\u000448\u000438
   * @returns {{x: number, y: number}}
   */
  getMousePosition() {
    return { x: this.mouseX, y: this.mouseY };
  }
}
