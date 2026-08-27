/**
 * Генератор процедурных подземелий
 * Создаёт комнаты и коридоры для каждого этажа
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
   * Генерация карты этажа
   * @param {number} floor - Номер этажа
   * @returns {Object} Данные уровня
   */
  generate(floor) {
    this.map = [];
    
    // Инициализация карты стенами
    for (let y = 0; y < this.height; y++) {
      this.map[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.map[y][x] = 1; // 1 - стена
      }
    }
    
    // Генерация комнат
    const rooms = this.generateRooms(floor);
    
    // Соединение комнат коридорами
    this.connectRooms(rooms);
    
    return {
      map: this.map,
      rooms: rooms,
      tileSize: this.tileSize,
      floor: floor
    };
  }

  /**
   * Генерация комнат
   * @param {number} floor - Номер этажа
   * @returns {Array} Список комнат
   * @private
   */
  generateRooms(floor) {
    const rooms = [];
    const roomCount = 5 + floor;
    const maxAttempts = 100;
    
    for (let i = 0; i < roomCount; i++) {
      let attempts = 0;
      let roomCreated = false;
      
      while (!roomCreated && attempts < maxAttempts) {
        attempts++;
        
        const roomWidth = 5 + Math.floor(Math.random() * 10);
        const roomHeight = 5 + Math.floor(Math.random() * 10);
        const roomX = Math.floor(Math.random() * (this.width - roomWidth - 2)) + 1;
        const roomY = Math.floor(Math.random() * (this.height - roomHeight - 2)) + 1;
        
        const room = {
          x: roomX,
          y: roomY,
          width: roomWidth,
          height: roomHeight,
          centerX: roomX + Math.floor(roomWidth / 2),
          centerY: roomY + Math.floor(roomHeight / 2)
        };
        
        // Проверка пересечения
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
   * Проверка пересечения комнат
   * @param {Object} room1 - Первая комната
   * @param {Object} room2 - Вторая комната
   * @returns {boolean} Пересекаются ли комнаты
   * @private
   */
  roomsOverlap(room1, room2) {
    return room1.x < room2.x + room2.width + 1 &&
           room1.x + room1.width + 1 > room2.x &&
           room1.y < room2.y + room2.height + 1 &&
           room1.y + room1.height + 1 > room2.y;
  }

  /**
   * Вырезание комнаты в карте
   * @param {Object} room - Комната
   * @private
   */
  carveRoom(room) {
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        this.map[y][x] = 0;
      }
    }
  }

  /**
   * Соединение комнат коридорами
   * @param {Array} rooms - Список комнат
   * @private
   */
  connectRooms(rooms) {
    for (let i = 0; i < rooms.length - 1; i++) {
      const room1 = rooms[i];
      const room2 = rooms[i + 1];
      
      this.carveCorridor(
        room1.centerX, room1.centerY,
        room2.centerX, room2.centerY
      );
    }
  }

  /**
   * Вырезание коридора между точками
   * @param {number} x1 - Начальная X
   * @param {number} y1 - Начальная Y
   * @param {number} x2 - Конечная X
   * @param {number} y2 - Конечная Y
   * @private
   */
  carveCorridor(x1, y1, x2, y2) {
    // Горизонтальный коридор
    const startX = Math.min(x1, x2);
    const endX = Math.max(x1, x2);
    for (let x = startX; x <= endX; x++) {
      this.map[y1][x] = 0;
      if (y1 > 0) this.map[y1 - 1][x] = 0;
      if (y1 < this.height - 1) this.map[y1 + 1][x] = 0;
    }
    
    // Вертикальный коридор
    const startY = Math.min(y1, y2);
    const endY = Math.max(y1, y2);
    for (let y = startY; y <= endY; y++) {
      this.map[y][x2] = 0;
      if (x2 > 0) this.map[y][x2 - 1] = 0;
      if (x2 < this.width - 1) this.map[y][x2 + 1] = 0;
    }
  }

  /**
   * Отрисовка карты
   * @param {CanvasRenderingContext2D} ctx - Контекст canvas
   * @param {Camera} camera - Камера
   */
  render(ctx, camera) {
    const startTileX = Math.floor(camera.x / this.tileSize);
    const startTileY = Math.floor(camera.y / this.tileSize);
    const endTileX = Math.ceil((camera.x + camera.game.width) / this.tileSize);
    const endTileY = Math.ceil((camera.y + camera.game.height) / this.tileSize);
    
    for (let y = startTileY; y <= endTileY && y < this.height; y++) {
      for (let x = startTileX; x <= endTileX && x < this.width; x++) {
        if (this.map[y] && this.map[y][x] === 1) {
          this.renderWall(ctx, x * this.tileSize, y * this.tileSize);
        }
      }
    }
  }

  /**
   * Отрисовка стены
   * @param {CanvasRenderingContext2D} ctx - Контекст canvas
   * @param {number} x - Позиция X
   * @param {number} y - Позиция Y
   * @private
   */
  renderWall(ctx, x, y) {
    // Основной цвет стены
    ctx.fillStyle = '#2d1b00';
    ctx.fillRect(x, y, this.tileSize, this.tileSize);
    
    // Текстура
    ctx.fillStyle = '#4a3520';
    ctx.fillRect(x + 2, y + 2, this.tileSize - 4, this.tileSize - 4);
    
    // Случайные золотые прожилки
    if (Math.random() < 0.05) {
      ctx.fillStyle = '#8b6914';
      ctx.fillRect(x + Math.random() * 20, y + Math.random() * 20, 4, 4);
    }
  }
}
