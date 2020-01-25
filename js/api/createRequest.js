/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {

    const dataList = [];
   
    if (options.data) {
        for (const prop in options.data) {
            if (options.data.hasOwnProperty(prop)) {
                const element = `${prop}=${options.data[prop]}`;
                dataList.push(element);
            }
        }
    }

    const method = options.method;
    
    let url = options.url;

    const xhr = new XMLHttpRequest();
    const headers = options.headers;
    for (let header in headers) {
        if (headers.hasOwnProperty(header)) {
            xhr.setRequestHeader(header, headers[header]);
        }   
    }

    xhr.responseType = options.responseType;
    xhr.withCredentials = true;

    if (method == "GET") {
        const urlParams = dataList.join('&');
        url = `${url}?${urlParams}`;
        xhr.open(method, url);
        xhr.send();
    } else {
        const formData = new FormData();
        for (let prop in options.data) {
            if (options.data.hasOwnProperty(prop)) {
                formData.append(prop, options.data[prop]);
            }
        }

        xhr.open(method, url);
        xhr.send(formData);
    }

    xhr.onload = () => {
        if (xhr.status != 200) {
            const err = `Ошибка ${xhr.status}: ${xhr.statusText}`;
            options.callback(err);
        } else {
            const response = xhr.response;
            options.callback(null, response);
        }
    }

    xhr.onerror = () => {
        const err = 'Ошибка запроса';
        options.callback(err);
    }

    return xhr;
};