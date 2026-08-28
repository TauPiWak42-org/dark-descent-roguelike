/**
 * Генератор процедурных подземелий
 * TOPDOWN game - player spawns in a room, all rooms connected
 * @class MapGenerator
 */
export class MapGenerator {
  constructor(width = 100, height = 100) {
    this.width = width;
    this.height = height;
    this.tileSize = 32;
    this.map = [];
  }

  generate(floor) {
    this.map = [];
    
    // Инициализация карты стенами
    for (let y = 0; y < this.height; y++) {
      this.map[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.map[y][x] = 1; // 1 - стена
      }
    }
    
    const rooms = this.generateRooms(floor);
    const playerStartRoom = rooms[0];
    this.connectAllRooms(rooms);
    this.addGoldVeins();
    
    return {
      map: this.map,
      rooms: rooms,
      tileSize: this.tileSize,
      floor: floor,
      playerStartX: playerStartRoom.centerX * this.tileSize,
      playerStartY: playerStartRoom.centerY * this.tileSize
    };
  }

  generateRooms(floor) {
    const rooms = [];
    const roomCount = 5 + Math.floor(floor * 0.5);
    const maxAttempts = 100;
    
    for (let i = 0; i < roomCount; i++) {
      let attempts = 0;
      let roomCreated = false;
      
      while (!roomCreated && attempts < maxAttempts) {
        attempts++;
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

  roomsOverlap(room1, room2) {
    return room1.x < room2.x + room2.width + 1 &&
           room1.x + room1.width + 1 > room2.x &&
           room1.y < room2.y + room2.height + 1 &&
           room1.y + room1.height + 1 > room2.y;
  }

  carveRoom(room) {
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
          this.map[y][x] = 0; // 0 - пол
        }
      }
    }
  }

  connectAllRooms(rooms) {
    for (let i = 1; i < rooms.length; i++) {
      this.carveCorridor(
        rooms[i].centerX, rooms[i].centerY,
        rooms[i - 1].centerX, rooms[i - 1].centerY
      );
    }
  }

  carveCorridor(x1, y1, x2, y2) {
    // Горизонтальный коридор
    const startX = Math.min(x1, x2);
    const endX = Math.max(x1, x2);
    for (let x = startX; x <= endX; x++) {
      if (y1 >= 0 && y1 < this.height && x >= 0 && x < this.width) {
        this.map[y1][x] = 0;
        if (y1 > 0) this.map[y1 - 1][x] = 0;
        if (y1 < this.height - 1) this.map[y1 + 1][x] = 0;
      }
    }
    // Вертикальный коридор
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

  addGoldVeins() {
    const veinCount = 20 + Math.floor(Math.random() * 30);
    for (let i = 0; i < veinCount; i++) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);
      if (this.map[y][x] === 1 && Math.random() < 0.1) {
        this.map[y][x] = 3; // Gold vein
      }
    }
  }

  render(ctx, camera) {
    const tileSize = this.tileSize;
    const startTileX = Math.floor(camera.x / tileSize);
    const startTileY = Math.floor(camera.y / tileSize);
    const endTileX = Math.ceil((camera.x + camera.game.width) / tileSize) + 1;
    const endTileY = Math.ceil((camera.y + camera.game.height) / tileSize) + 1;
    
    for (let y = startTileY; y <= endTileY && y < this.height; y++) {
      if (y < 0) continue;
      for (let x = startTileX; x <= endTileX && x < this.width; x++) {
        if (x < 0) continue;
        const tile = this.map[y][x];
        const screenX = x * tileSize - camera.x;
        const screenY = y * tileSize - camera.y;
        
        if (tile === 1) {
          // Стена - синий кирпич
          this.renderWall(ctx, screenX, screenY);
        } else if (tile === 0) {
          // Пол - серая плитка с вариациями
          this.renderFloor(ctx, screenX, screenY, x, y);
        } else if (tile === 3) {
          // Золотая жила
          this.renderGoldVein(ctx, screenX, screenY);
        }
      }
    }
  }

  renderFloor(ctx, x, y, tileX, tileY) {
    // Вариации серого для пола
    const variation = ((tileX * 7 + tileY * 13) % 4) / 100;
    const baseGray = 50 + Math.floor(variation * 20);
    ctx.fillStyle = `rgb(${baseGray}, ${baseGray}, ${baseGray + 5})`;
    ctx.fillRect(x, y, this.tileSize, this.tileSize);
    
    // Тонкая обводка для эффекта плитки
    ctx.strokeStyle = `rgb(${baseGray - 10}, ${baseGray - 10}, ${baseGray - 5})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, this.tileSize, this.tileSize);
  }

  renderWall(ctx, x, y) {
    // Тёмно-синий кирпич для стены
    ctx.fillStyle = '#1a3a5c';
    ctx.fillRect(x, y, this.tileSize, this.tileSize);
    
    // Эффект кирпичей
    ctx.fillStyle = '#0f2a40';
    ctx.fillRect(x, y + this.tileSize/2 - 1, this.tileSize, 2);
    ctx.fillRect(x + this.tileSize/2 - 1, y, 2, this.tileSize/2 - 1);
    ctx.fillRect(x + this.tileSize/2, y + this.tileSize/2 + 1, 2, this.tileSize/2 - 1);
    
    // Обводка
    ctx.strokeStyle = '#0a1a2a';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, this.tileSize, this.tileSize);
  }

  renderGoldVein(ctx, x, y) {
    ctx.fillStyle = '#2d1b00';
    ctx.fillRect(x, y, this.tileSize, this.tileSize);
    ctx.fillStyle = '#6b4c2a';
    ctx.fillRect(x + 2, y + 2, this.tileSize - 4, this.tileSize - 4);
    const veinSize = Math.random() * 8 + 4;
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(x + (this.tileSize - veinSize) / 2, y + (this.tileSize - veinSize) / 2, veinSize, veinSize);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x + (this.tileSize - veinSize) / 2 + 2, y + (this.tileSize - veinSize) / 2 + 2, veinSize - 4, veinSize - 4);
  }
}
