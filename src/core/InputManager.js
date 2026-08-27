/**
 * InputManager
 * 233f4030323b4f3542 32323e343e3c 3f3e3b4c373e323042353b4f353c
 * @class InputManager
 */
export class InputManager {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    
    // 1c4b484c
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;
    this.mouseUp = false;
    this.mousePressed = false;
    
    // 1a3b303238483043404b
    this.keys = {};
    this.keysPressed = {};
    this.keysReleased = {};
    
    this.setupEventListeners();
  }

  /**
   * 1d304142403e393a30 413b43483042353b3539
   * @private
   */
  setupEventListeners() {
    // 1c4b484c 34323836353d384f
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
    
    this.canvas.addEventListener('mousedown', (e) => {
      this.mouseDown = true;
      this.mousePressed = true;
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
    
    this.canvas.addEventListener('mouseup', (e) => {
      this.mouseDown = false;
      this.mouseUp = true;
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.mouseDown = false;
    });
    
    // 1a3b303238483043404b
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      this.keysPressed[e.key] = true;
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
      this.keysReleased[e.key] = true;
    });
  }

  /**
   * 2131403e41 32413545 413e41423e4f3d384f 32323e3430
   */
  update() {
    this.mousePressed = false;
    this.mouseUp = false;
    this.keysPressed = {};
    this.keysReleased = {};
  }

  /**
   * 1f403e3235403a30 3d303630423040 3a3b3032384830
   * @param {string} key
   * @returns {boolean}
   */
  isKeyPressed(key) {
    return this.keysPressed[key] || false;
  }

  /**
   * 1f403e3235403a30 3e423f4349353d30 3a3b3032384830
   * @param {string} key
   * @returns {boolean}
   */
  isKeyReleased(key) {
    return this.keysReleased[key] || false;
  }

  /**
   * 1f403e3235403a30 373036304230 3a3b3032384830
   * @param {string} key
   * @returns {boolean}
   */
  isKeyDown(key) {
    return this.keys[key] || false;
  }

  /**
   * 1f403e3235403a30 413b303630423040 3c4b4838
   * @returns {boolean}
   */
  isMousePressed() {
    return this.mousePressed;
  }

  /**
   * 1f403e3235403a30 3e423f4349353d30 3c4b4838
   * @returns {boolean}
   */
  isMouseReleased() {
    return this.mouseUp;
  }

  /**
   * 1f403e3235403a30 373036304230 3c4b4838 373040304230
   * @returns {boolean}
   */
  isMouseDown() {
    return this.mouseDown;
  }

  /**
   * 1f3e3b474730424c 3a3e3e4034383d30424b 3c4b4838
   * @returns {{x: number, y: number}}
   */
  getMousePosition() {
    return { x: this.mouseX, y: this.mouseY };
  }
}
