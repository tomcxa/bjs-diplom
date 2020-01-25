/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство HOST, равно значению Entity.HOST.
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static HOST = Entity.HOST;
  static URL = '/user';
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user'));
    } else {
      return;
    }
    
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch( data, callback = f => f ) {
    const url = User.HOST + User.URL + '/current';
    const method = 'GET';
    const responseType = 'json';

    const xhr = createRequest({
      url,
      method,
      responseType,
      data,
      callback(err, response) {
        
        if (response && response.user) {
          User.setCurrent(response.user);
        } else {
          User.unsetCurrent();
        }
        callback(err, response);
      }
    });

    return xhr;
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login( data, callback = f => f ) {
    const url = User.HOST + User.URL + '/login';
    const method = 'POST';
    const responseType = 'json';

    const xhr = createRequest({
      url,
      method,
      responseType,
      data,
      callback(err, response) {
        
        if (response && response.user) {
          User.setCurrent(response.user);
        }
        callback(err, response);
      }
    });

    return xhr;
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register( data, callback = f => f ) {
    const url = User.HOST + User.URL + '/register';
    const method = 'POST';
    const responseType = 'json';
    console.log(typeof data);

    const xhr = createRequest({
      url,
      method,
      responseType,
      data,
      callback(err, response) {
        
        if (response && response.user) {
          User.setCurrent(response.user);
        }
        callback(err, response);
      }
    });

    return xhr;
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout( data, callback = f => f ) {
    const url = User.HOST + User.URL + '/logout';
    const method = 'POST';
    const responseType = 'json';

    const xhr = createRequest({
      url,
      method,
      responseType,
      data,
      callback(err, response) {
        if (response) {
          User.unsetCurrent();
        }
        callback(err, response);
      }
    });

    return xhr;
  }
}