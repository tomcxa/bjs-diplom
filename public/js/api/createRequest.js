/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    let url = options.url;
    const username = options.data.mail;
    const password = options.data.password;
    const method = options.method;
    const formData = new FormData();
    let err = null;
    let response;
    console.log('Start')

    if (method == "GET") {
        url = `${url}?mail=${username}&password=${password}`;
        xhr.open(method, url);
        xhr.withCredentials = true;
        xhr.send();
        console.log('GET')
    } else {
        formData.append('mail', username);
        formData.append('password', password);
        xhr.open(method, url);
        xhr.withCredentials = true;
        xhr.send(formData);
        console.log('POST')
    }

    xhr.onload = () => {
        console.log('load')
        if (xhr.status != 200) {
            err = `Ошибка ${xhr.status}: ${xhr.statusText}`;
            options.callback(err, _);
        } else {
            response = xhr.response;
            options.callback(err, response);
        }
    }
};

const xhr = createRequest({
    url: 'http://localhost:8000',
    data: {
        mail: 'demo@demo',
        password: 'demo'
    },
    method: 'GET',
    callback: (err, response) => {
        console.log('Ошибка, если есть', err);
        console.log('Данные, если нет ошибки', response);
    }
});

