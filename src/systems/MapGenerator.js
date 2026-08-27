/**
 * \u000413\u000435\u00043d\u000435\u000440\u000430\u000442\u00043e\u000440 \u00043f\u000440\u00043e\u000446\u000435\u000434\u000443\u000440\u00043d\u00044b\u000445 \u00043f\u00043e\u000434\u000437\u000435\u00043c\u000435\u00043b\u000438\u000439
 * \u000421\u00043e\u000437\u000434\u000430\u000451\u000442 \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u00044b \u000438 \u00043a\u00043e\u000440\u000438\u000434\u00043e\u000440\u00044b \u000434\u00043b\u00044f \u00043a\u000430\u000436\u000434\u00043e\u000433\u00043e \u00044d\u000442\u000430\u000436\u000430\u000432
 * TOPDOWN game - player always spawns in a room, all rooms connected
 * @class MapGenerator
 */
export class MapGenerator {
  constructor(width = 100, height = 100) {
    this.width = width;
    this.height = height;
    this.tileSize = 32;
    this.map = [];
  }

  /**
   * \u000413\u000435\u00043d\u000435\u000440\u000430\u000446\u000438\u00044f \u00043a\u000430\u000440\u000442\u00044b \u000441\u00043b\u000443\u000447\u000430\u000439\u00043d\u00043e\u000433\u00043e \u000441\u00043b\u00043e\u000436\u00043d\u00043e\u000433\u00043e \u00044d\u000442\u000430\u000436\u000430\u000432
   * \u00041f\u00043b\u000430\u000435\u000440 \u000432\u000441\u000435\u000433\u000434\u000430 \u000441\u00043f\u000430\u000432\u00043d\u000438\u000442\u000441\u00044f \u000432 \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u000435
   * @param {number} floor - \u00041d\u00043e\u00043c\u000435\u000440 \u00044d\u000442\u000430\u000436\u000430\u000432
   * @returns {Object} \u000414\u000430\u00043d\u00043d\u00044b\u000435 \u000443\u000440\u00043e\u000432\u00043d\u00044f
   */
  generate(floor) {
    this.map = [];
    
    // \u000418\u00043d\u000438\u000446\u000438\u000430\u00043b\u000438\u000437\u000430\u000446\u000438\u00044f \u00043a\u000430\u000440\u000442\u00044b \u000441\u000442\u000435\u00043d\u000430\u00043c\u000438
    for (let y = 0; y < this.height; y++) {
      this.map[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.map[y][x] = 1; // 1 - \u000441\u000442\u000435\u00043d\u000430
      }
    }
    
    // \u000413\u000435\u00043d\u000435\u000440\u000430\u000446\u000438\u00044f \u00043a\u00043e\u00043c\u00043d\u000430\u000442
    const rooms = this.generateRooms(floor);
    
    // TOPDOWN: \u000412\u000441\u000435 \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u00044b \u000441\u000432\u00044f\u000437\u000430\u00043d\u00044b \u000434\u000440\u000435\u000434\u00043c\u000435\u000442\u00043e\u00043c
    // \u00041f\u000440\u00043e\u000432\u000435\u000440\u00044f \u000441\u000432\u00044f\u000437\u00043d\u00043e\u000441\u000442\u000438 \u000432 \u000441\u00043b\u000443\u000447\u000430\u000439\u00043d\u00043e\u000439 \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u000435
    const playerStartRoom = rooms[0];
    
    // TOPDOWN: \u000421\u00043e\u000435\u000434\u000438\u00043d\u000435\u00043d\u000438\u000435 \u000432\u000441\u000435 \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u00044b \u00043a\u00043e\u000440\u000438\u000434\u00043e\u000440\u000430\u000434\u00043e\u000432
    // \u00041f\u00043e \u000443\u00043c\u00043e\u00043b\u000447\u000430\u00043d\u000438\u00044e \u00043a\u000430\u000436\u000434\u000434\u00043e\u000439 \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u000430\u00043c
    this.connectAllRooms(rooms);
    
    return {
      map: this.map,
      rooms: rooms,
      tileSize: this.tileSize,
      floor: floor,
      // TOPDOWN: \u00041d\u000430\u000447\u000430\u000442\u00043a\u000430\u000441\u000430\u000440\u000442\u000430\u000432 \u000441\u00043f\u000430\u000432\u00043d\u000430\u000433\u00043e \u000432 \u000441\u00043b\u000443\u000447\u000430\u000439\u00043d\u00043e\u000439 \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u000435
      playerStartX: playerStartRoom.centerX * this.tileSize,
      playerStartY: playerStartRoom.centerY * this.tileSize
    };
  }

  /**
   * \u000413\u000435\u00043d\u000435\u000440\u000430\u000446\u000438\u00044f \u00043a\u00043e\u00043c\u00043d\u000430\u000442
   * @param {number} floor - \u00041d\u00043e\u00043c\u000435\u000440 \u00044d\u000442\u000430\u000436\u000430\u000432
   * @returns {Array} \u000421\u00043f\u000438\u000441\u00043e\u00043a \u00043a\u00043e\u00043c\u00043d\u000430\u000442
   * @private
   */
  generateRooms(floor) {
    const rooms = [];
    const roomCount = 5 + Math.floor(floor * 0.5);
    const maxAttempts = 100;
    
    for (let i = 0; i < roomCount; i++) {
      let attempts = 0;
      let roomCreated = false;
      
      while (!roomCreated && attempts < maxAttempts) {
        attempts++;
        
        // TOPDOWN: \u00041c\u000438\u00043d\u000438\u00043c\u000430\u00043b\u00044c\u00043d\u00044b\u000439 \u000440\u000430\u000437\u00043c\u000435\u000440 \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u00044b
        const roomWidth = 8 + Math.floor(Math.random() * 8);
        const roomHeight = 6 + Math.floor(Math.random() * 6);
        const roomX = Math.floor(Math.random() * (this.width - roomWidth - 4)) + 2;
        const roomY = Math.floor(Math.random() * (this.height - roomHeight - 4)) + 2;
        
        const room = {
          x: roomX,
          y: roomY,
          width: roomWidth,
          height: roomHeight,
          centerX: Math.floor(roomX + roomWidth / 2),
          centerY: Math.floor(roomY + roomHeight / 2)
        };
        
        // \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u00043f\u000435\u000440\u000435\u000441\u000435\u000447\u000435\u00043d\u000438\u00044f
        let overlapping = false;
        for (const existingRoom of rooms) {
          if (this.roomsOverlap(room, existingRoom)) {
            overlapping = true;
            break;
          }
        }
        
        if (!overlapping) {
          rooms.push(room);
          this.carveRoom(room);
          roomCreated = true;
        }
      }
    }
    
    return rooms;
  }

  /**
   * \u00041f\u000440\u00043e\u000432\u000435\u000440\u00043a\u000430 \u00043f\u000435\u000440\u000435\u000441\u000435\u000447\u000435\u00043d\u000438\u00044f \u00043a\u00043e\u00043c\u00043d\u000430\u000442
   * @param {Object} room1 - \u00041f\u000435\u000440\u000432\u000430\u00044f \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u000430
   * @param {Object} room2 - \u000412\u000442\u00043e\u000440\u000430\u00044f \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u000430
   * @returns {boolean} \u00041f\u000435\u000440\u000435\u000441\u000435\u00043a\u000430\u00044e\u000442\u000441\u00044f \u00043b\u000438 \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u00044b
   * @private
   */
  roomsOverlap(room1, room2) {
    return room1.x < room2.x + room2.width + 1 &&
           room1.x + room1.width + 1 > room2.x &&
           room1.y < room2.y + room2.height + 1 &&
           room1.y + room1.height + 1 > room2.y;
  }

  /**
   * \u000412\u00044b\u000440\u000435\u000437\u000430\u00043d\u000438\u000435 \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u00044b \u000432 \u00043a\u000430\u000440\u000442\u000435
   * @param {Object} room - \u00041a\u00043e\u00043c\u00043d\u000430\u000442\u000430
   * @private
   */
  carveRoom(room) {
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
          this.map[y][x] = 0;
        }
      }
    }
  }

  /**
   * TOPDOWN: \u000421\u00043e\u000435\u000434\u000438\u00043d\u000435\u00043d\u000438\u000435 \u000432\u000441\u000435 \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u00044b \u00043a\u00043e\u000440\u000438\u000434\u00043e\u000440\u000430\u000434\u00043e\u00043c
   * \u000412\u000430\u00043f\u000440\u000430\u000432 \u000441\u00043e\u000435\u000434\u000438\u00043d\u00044f \u000432\u000441\u000435 \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u00044b
   * @param {Array} rooms - \u000421\u00043f\u000438\u000441\u00043e\u00043a \u00043a\u00043e\u00043c\u00043d\u000430\u000442
   * @private
   */
  connectAllRooms(rooms) {
    // TOPDOWN: \u000412\u00043e\u000434 \u000441\u00043e\u000435\u000434\u000438\u00043d\u000438\u000442\u00044c \u000432\u000441\u000435 \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u00044b \u000441 \u000441\u000434\u000443\u000433\u000438\u00043c\u000438
    // \u00041f\u00043e \u000443\u00043c\u00043e\u00043b\u000447\u000430\u00043d\u000438\u00044e \u00043a\u000430\u000436\u000434\u00043e\u000439 \u00043a\u00043e\u00043c\u00043d\u000430\u000442\u000430\u00043c
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        this.carveCorridor(
          rooms[i].centerX, rooms[i].centerY,
          rooms[j].centerX, rooms[j].centerY
        );
      }
    }
  }

  /**
   * \u000412\u00044b\u000440\u000435\u000437\u000430\u00043d\u000438\u000435 \u00043a\u00043e\u000440\u000438\u000434\u00043e\u000440\u000430\u000434 \u00043c\u000435\u000436\u000434\u000443 \u000442\u00043e\u000447\u00043a\u000430\u00043c\u000438
   * @param {number} x1 - \u00041d\u000430\u000447\u000430\u00043b\u00044c\u00043d\u000430\u00044f X
   * @param {number} y1 - \u00041d\u000430\u000447\u000430\u00043b\u00044c\u00043d\u000430\u00044f Y
   * @param {number} x2 - \u00041a\u00043e\u00043d\u000435\u000447\u00043d\u000430\u00044f X
   * @param {number} y2 - \u00041a\u00043e\u00043d\u000435\u000447\u00043d\u000430\u00044f Y
   * @private
   */
  carveCorridor(x1, y1, x2, y2) {
    // \u000413\u00043e\u000440\u000438\u000437\u00043e\u00043d\u000442\u000430\u00043b\u00044c\u00043d\u00044b\u000439 \u00043a\u00043e\u000440\u000438\u000434\u00043e\u000440
    const startX = Math.min(x1, x2);
    const endX = Math.max(x1, x2);
    for (let x = startX; x <= endX; x++) {
      if (y1 >= 0 && y1 < this.height && x >= 0 && x < this.width) {
        this.map[y1][x] = 0;
        if (y1 > 0) this.map[y1 - 1][x] = 0;
        if (y1 < this.height - 1) this.map[y1 + 1][x] = 0;
      }
    }
    
    // \u000412\u000435\u000440\u000442\u000438\u00043a\u000430\u00043b\u00044c\u00043d\u00044b\u000439 \u00043a\u00043e\u000440\u000438\u000434\u00043e\u000440
    const startY = Math.min(y1, y2);
    const endY = Math.max(y1, y2);
    for (let y = startY; y <= endY; y++) {
      if (x2 >= 0 && x2 < this.width && y >= 0 && y < this.height) {
        this.map[y][x2] = 0;
        if (x2 > 0) this.map[y][x2 - 1] = 0;
        if (x2 < this.width - 1) this.map[y][x2 + 1] = 0;
      }
    }
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u00043a\u000430 \u00043a\u000430\u000440\u000442\u00044b
   * @param {CanvasRenderingContext2D} ctx - \u00041a\u00043e\u00043d\u000442\u000435\u00043a\u000441\u000442 canvas
   * @param {Camera} camera - \u00041a\u000430\u00043c\u000435\u000440\u000430
   */
  render(ctx, camera) {
    const startTileX = Math.floor(camera.x / this.tileSize);
    const startTileY = Math.floor(camera.y / this.tileSize);
    const endTileX = Math.ceil((camera.x + camera.game.width) / this.tileSize);
    const endTileY = Math.ceil((camera.y + camera.game.height) / this.tileSize);
    
    for (let y = startTileY; y <= endTileY && y < this.height; y++) {
      for (let x = startTileX; x <= endTileX && x < this.width; x++) {
        if (this.map[y] && this.map[y][x] === 1) {
          this.renderWall(ctx, x * this.tileSize - camera.x, y * this.tileSize - camera.y);
        }
      }
    }
  }

  /**
   * \u00041e\u000442\u000440\u000438\u000441\u00043e\u000432\u00043a\u000430 \u000441\u000442\u000435\u00043d\u00044b
   * @param {CanvasRenderingContext2D} ctx - \u00041a\u00043e\u00043d\u000442\u000435\u00043a\u000441\u000442 canvas
   * @param {number} x - \u00041f\u00043e\u000437\u000438\u000446\u000438\u00044f X
   * @param {number} y - \u00041f\u00043e\u000437\u000438\u000446\u000438\u00044f Y
   * @private
   */
  renderWall(ctx, x, y) {
    // \u00041e\u000441\u00043d\u00043e\u000432\u00043d\u000430\u00044f \u000446\u000432\u000435\u000442 \u000441\u000442\u000435\u00043d\u00044b
    ctx.fillStyle = '#2d1b00';
    ctx.fillRect(x, y, this.tileSize, this.tileSize);
    
    // \u000422\u000435\u00043a\u000441\u000442\u000443\u000440\u000430
    ctx.fillStyle = '#4a3520';
    ctx.fillRect(x + 2, y + 2, this.tileSize - 4, this.tileSize - 4);
    
    // \u000421\u00043b\u000443\u000447\u000430\u000439\u00043d\u00044b\u000435 \u000437\u00043e\u00043b\u00043e\u000442\u00044b\u000435 \u00043f\u000440\u00043e\u000436\u000438\u00043b\u00043a\u000438
    if (Math.random() < 0.05) {
      ctx.fillStyle = '#8b6914';
      ctx.fillRect(x + Math.random() * 20, y + Math.random() * 20, 4, 4);
    }
  }
}
