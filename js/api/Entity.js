/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * Имеет свойство HOST, равно 'https://bhj-diplom.letsdocode.ru'.
 * */
class Entity {
  static URL = '';
  static HOST = 'https://bhj-diplom.letsdocode.ru';
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list(data, callback = f => f) {
    const url = this.HOST + this.URL;
    const method = "GET";
    const responseType = "json";
    const xhr = createRequest({
      url,
      data,
      responseType,
      method,
      callback,
    });

    return xhr;
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback = f => f) {
    const url = this.HOST + this.URL;
    const method = "POST";
    const responseType = "json";

    const newData = Object.assign({_method: 'PUT'}, data);

    const xhr = createRequest({
      url,
      data: newData,
      responseType,
      method,
      callback,
    });

    return xhr;
  }

  /**
   * Получает информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static get(id = '', data, callback = f => f) {
    const url = this.HOST + this.URL;
    const method = "GET";
    const responseType = "json";
    const newData = Object.assign({id: id}, data);
    const xhr = createRequest({
      url,
      data: newData,
      responseType,
      method,
      callback,
    });

    return xhr;
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(id = '', data, callback = f => f) {
    const url = this.HOST + this.URL;
    const method = "POST";
    const responseType = "json";

    const newData = Object.assign({_method: 'DELETE', id: id}, data);

    const xhr = createRequest({
      url,
      data: newData,
      responseType,
      method,
      callback,
    });

    return xhr;
  }
}