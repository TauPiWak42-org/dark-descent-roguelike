/**
 * NoiseGenerator
 * 13353d354030423e40 48433c3032 3f35403b383d30 343b4f 443e3d30
 * 1f403e4142304f 303b333e4038423c Perlin noise
 * @class NoiseGenerator
 */
export class NoiseGenerator {
  constructor(seed = Math.random()) {
    this.seed = seed;
    this.permutation = this.generatePermutation();
  }

  /**
   * 13353d35403046384f 3f35403c434230463838
   * @returns {Array}
   * @private
   */
  generatePermutation() {
    const p = [];
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }
    
    // 1f3540353c354830424c 3c30413e32 41353c353d353c4238
    const seedRandom = this.seedRandom(this.seed);
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(seedRandom() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    
    return [...p, ...p];
  }

  /**
   * 1f413532343e3b3d4b39 413b434730393d4b39 33353d354030423e4030
   * @param {number} seed
   * @returns {Function}
   * @private
   */
  seedRandom(seed) {
    let value = seed || 0x89abcdef;
    return () => {
      value = Math.sin(value) * 10000;
      return value - Math.floor(value);
    };
  }

  /**
   * 24433d3a46384f 413c354838323033
   * @param {number} t
   * @returns {number}
   * @private
   */
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /**
   * 1b383d35393d304f 303d30403e3f
   * @param {number} t
   * @returns {number}
   * @private
   */
  lerp(t, a, b) {
    return a + t * (b - a);
  }

  /**
   * 1340303438353d42 Perlin noise
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  perlin2(x, y) {
    // 1d30453e343842 46353b4b35 4135423a38
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    // 14403e313d304f 473041424c
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    // 243034353d42 3a403230473a38
    const u = this.fade(x);
    const v = this.fade(y);
    
    // 133036353d3835 32353a423e403032
    const p = this.permutation;
    const A = p[X] + Y;
    const AA = p[A];
    const AB = p[A + 1];
    const B = p[X + 1] + Y;
    const BA = p[B];
    const BB = p[B + 1];
    
    // 1340303438353d42 3340303438353d4230
    return this.lerp(v, 
      this.lerp(u, this.grad(AA, x, y), this.grad(BA, x - 1, y)),
      this.lerp(u, this.grad(AB, x, y - 1), this.grad(BB, x - 1, y - 1))
    );
  }

  /**
   * 1340303438353d42
   * @param {number} hash
   * @param {number} x
   * @param {number} y
   * @returns {number}
   * @private
   */
  grad(hash, x, y) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  /**
   * 13353d35403046384f 48433c3032 3a303c353d4c 3f354935404b
   * @param {number} x
   * @param {number} y
   * @param {number} scale - 1c304148423031 48433c30
   * @returns {number}
   */
  getCaveNoise(x, y, scale = 0.05) {
    // 1c30414842303138403e3230
    let value = this.perlin2(x * scale, y * scale);
    
    // 143e3130323b353d3835 413b3e38 48433c30
    value += this.perlin2(x * scale * 2, y * scale * 2) * 0.5;
    value += this.perlin2(x * scale * 4, y * scale * 4) * 0.25;
    
    // 1d3e403c303b38373046384f 3a 0-1
    return (value + 1) / 2;
  }

  /**
   * 13353d35403046384f 46323542 3f35403b383d30 343b4f 443e3d30
   * @param {number} noiseValue
   * @returns {string}
   */
  getCaveColor(noiseValue) {
    // 1230404c38403e32303d3d4b35 4632354230
    if (noiseValue < 0.3) {
      return '#1a1a2e'; // 22513c3d4b39 46323542
    } else if (noiseValue < 0.45) {
      return '#2d1b00'; // 1a3e4038473d35323d4b39 46323542
    } else if (noiseValue < 0.6) {
      return '#4a3520'; // 213235423b4b49 46323542
    } else if (noiseValue < 0.75) {
      return '#6b4c2a'; // 213235423b4e-404b363839 46323542
    } else {
      return '#8b6914'; // 173e3b3e423841424b39 303a46353d42
    }
  }
}
