/**
 * LoadingScreen
 * 1a3b304141 3730334043373a38
 * @class LoadingScreen
 */
export class LoadingScreen {
  constructor() {
    this.loadingScreen = document.getElementById('loading-screen');
    this.loadingProgress = document.getElementById('loading-progress');
    this.loadingText = document.getElementById('loading-text');
    this.gameContainer = document.getElementById('game-container');
    
    this.progress = 0;
    this.messages = [
      'Initializing game...',
      'Loading assets...',
      'Building world...',
      'Summoning enemies...',
      'Preparing spells...',
      'Almost ready...'
    ];
    this.currentMessage = 0;
  }

  /**
   * 1e313d3e323b353d3835 3f403e334035414130
   * @param {number} progress - 1f403e46353d42 (0-100)
   */
  updateProgress(progress) {
    this.progress = Math.min(100, Math.max(0, progress));
    this.loadingProgress.style.width = `${this.progress}%`;
    
    // 1e313d3e323b4f353c 413e3e3149353d384f
    if (this.progress >= 20 && this.currentMessage < 1) {
      this.currentMessage = 1;
      this.updateMessage();
    } else if (this.progress >= 40 && this.currentMessage < 2) {
      this.currentMessage = 2;
      this.updateMessage();
    } else if (this.progress >= 60 && this.currentMessage < 3) {
      this.currentMessage = 3;
      this.updateMessage();
    } else if (this.progress >= 80 && this.currentMessage < 4) {
      this.currentMessage = 4;
      this.updateMessage();
    } else if (this.progress >= 95 && this.currentMessage < 5) {
      this.currentMessage = 5;
      this.updateMessage();
    }
  }

  /**
   * 1e313d3e323b4f353c 413e3e3149353d3835
   * @private
   */
  updateMessage() {
    if (this.loadingText && this.messages[this.currentMessage]) {
      this.loadingText.textContent = this.messages[this.currentMessage];
    }
  }

  /**
   * 17303235404838424c 3730334043373a43
   */
  hide() {
    if (this.loadingScreen) {
      this.loadingScreen.classList.add('hidden');
    }
    if (this.gameContainer) {
      this.gameContainer.classList.add('loaded');
    }
  }

  /**
   * 1f3e3a303730424c 3730334043373a43
   */
  show() {
    if (this.loadingScreen) {
      this.loadingScreen.classList.remove('hidden');
    }
    if (this.gameContainer) {
      this.gameContainer.classList.remove('loaded');
    }
  }
}
