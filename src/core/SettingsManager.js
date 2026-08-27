/**
 * SettingsManager
 * 233f4030323b4f3542 3d304142403e393a303c38 3833404b
 * 1e42323547303542 3730 413e4540303d353d3835 32 localStorage
 * @class SettingsManager
 */
export class SettingsManager {
  constructor() {
    // 1732433a 3f3e 433c3e3b47303d384e
    this.settings = {
      soundEnabled: true,
      soundVolume: 80,
      uiScale: 100,
      fontScale: 100,
      debugMode: false
    };
    
    this.loadSettings();
  }

  /**
   * 1730334043373a30 3d304142403e353a 3837 localStorage
   * @private
   */
  loadSettings() {
    const saved = localStorage.getItem('gameSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.settings = { ...this.settings, ...parsed };
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }

  /**
   * 213e4540303d353d3835 3d304142403e393a38 32 localStorage
   * @private
   */
  saveSettings() {
    localStorage.setItem('gameSettings', JSON.stringify(this.settings));
  }

  /**
   * 1f3e3b4347353d3835 3732433a30
   * @param {boolean} enabled - 123a3b/324b3a3b
   */
  setSoundEnabled(enabled) {
    this.settings.soundEnabled = enabled;
    this.saveSettings();
  }

  /**
   * 1f3e3b4347353d3835 33403e3c3a3e414238
   * @param {number} volume - 23403e32353d4c (0-100)
   */
  setSoundVolume(volume) {
    this.settings.soundVolume = Math.max(0, Math.min(100, volume));
    this.saveSettings();
  }

  /**
   * 18373c353d353d38424c 33403e3c3a3e414238 3d30 5%
   */
  increaseSoundVolume() {
    this.setSoundVolume(this.settings.soundVolume + 5);
  }

  /**
   * 233c353d4c4838424c 33403e3c3a3e414238 3d30 5%
   */
  decreaseSoundVolume() {
    this.setSoundVolume(this.settings.soundVolume - 5);
  }

  /**
   * 1f3e3b4347353d3835 4030373c3540 UI
   * @param {number} scale - 1c304148423031 (50-300)
   */
  setUiScale(scale) {
    this.settings.uiScale = Math.max(50, Math.min(300, scale));
    this.saveSettings();
  }

  /**
   * 2332353b384738424c 4030373c3540 UI 3d30 10%
   */
  increaseUiScale() {
    this.setUiScale(this.settings.uiScale + 10);
  }

  /**
   * 233c353d4c4838424c 4030373c3540 UI 3d30 10%
   */
  decreaseUiScale() {
    this.setUiScale(this.settings.uiScale - 10);
  }

  /**
   * 1f3e3b4347353d3835 4030373c3540 484038444230
   * @param {number} scale - 1c304148423031 (50-300)
   */
  setFontScale(scale) {
    this.settings.fontScale = Math.max(50, Math.min(300, scale));
    this.saveSettings();
  }

  /**
   * 2332353b384738424c 4030373c3540 484038444230 3d30 10%
   */
  increaseFontScale() {
    this.setFontScale(this.settings.fontScale + 10);
  }

  /**
   * 233c353d4c4838424c 4030373c3540 484038444230 3d30 10%
   */
  decreaseFontScale() {
    this.setFontScale(this.settings.fontScale - 10);
  }

  /**
   * 1f3540353a3b4e4730424c debug mode
   * @param {boolean} enabled - 123a3b/324b3a3b
   */
  setDebugMode(enabled) {
    this.settings.debugMode = enabled;
    this.saveSettings();
  }

  /**
   * 1f3e3b4347353d3835 32413545 3d304142403e393a38
   * @returns {Object} 1a3e3f384f 32413545 3d304142403e353a
   */
  getSettings() {
    return { ...this.settings };
  }

  /**
   * 2131403e41 3d304142403e353a 3a 433c3e3b47303d384e
   */
  resetToDefaults() {
    this.settings = {
      soundEnabled: true,
      soundVolume: 80,
      uiScale: 100,
      fontScale: 100,
      debugMode: false
    };
    this.saveSettings();
  }

  /**
   * 1f3e3b4347353d3835 413e314b423835 3f4038 38373c353d353d3838 3d304142403e353a
   * @param {string} key - 1a3b4e47
   * @returns {*}
   */
  get(key) {
    return this.settings[key];
  }
}
