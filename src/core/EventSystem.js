/**
 * Система событий для межмодульного взаимодействия
 * Реализует паттерн Observer
 * @class EventSystem
 */
export class EventSystem {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this.listeners = new Map();
  }

  /**
   * Подписка на событие
   * @param {string} event - Название события
   * @param {Function} callback - Функция обратного вызова
   * @returns {Function} Функция для отписки от события
   */
  on(event, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event).add(callback);

    return () => this.off(event, callback);
  }

  /**
   * Отписка от события
   * @param {string} event - Название события
   * @param {Function} callback - Функция обратного вызова
   */
  off(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      
      if (callbacks.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Вызов события
   * @param {string} event - Название события
   * @param {*} data - Данные для передачи слушателям
   */
  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  /**
   * Подписка на событие с автоматической отпиской после первого вызова
   * @param {string} event - Название события
   * @param {Function} callback - Функция обратного вызова
   */
  once(event, callback) {
    let called = false;
    const wrapper = (data) => {
      if (called) return;
      called = true;
      this.off(event, wrapper);
      callback(data);
    };
    
    this.on(event, wrapper);
    return () => this.off(event, wrapper);
  }

  /**
   * Очистка всех слушателей
   */
  clear() {
    this.listeners.clear();
  }

  /**
   * Получение количества слушателей события
   * @param {string} event - Название события
   * @returns {number} Количество слушателей
   */
  listenerCount(event) {
    const callbacks = this.listeners.get(event);
    return callbacks ? callbacks.size : 0;
  }
}
