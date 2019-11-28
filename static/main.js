"use strict";

class Profile {
    constructor({ username, name: { firstName, lastName }, password }) {
        this.username = username;
        this.name = { firstName, lastName };
        this.password = password;
    }

    addUser(callback) {
        console.log(`Adding new user: ${this.username}`);
        return ApiConnector.createUser({
            username: this.username,
            name: this.name,
            password: this.password,
        }, (err, data) => {
            console.log(`Created new user: ${this.username}`);
            callback(err, data);
        });
    }

    authorization(callback) {
        console.log(`Try login...`);
        return ApiConnector.performLogin({
            username: this.username,
            password: this.password,
        }, (err, data) => {
            console.log(`Login ${this.username} completed`);
            callback(err, data);
        });
    }

    addMoney({ currency, amount }, callback) {
        console.log(`Adding ${amount} ${currency} to ${this.username}`);
        return ApiConnector.addMoney({ currency, amount }, (err, data) => {
            console.log(`Added ${amount} ${currency} to ${this.username}`);
            callback(err, data);
        });
    }

    currencyСonversion({ fromCurrency, targetCurrency, targetAmount }, callback) {
        return ApiConnector.convertMoney({ fromCurrency, targetCurrency, targetAmount }, (err, data) => {
            console.log(`Converted from ${fromCurrency} to ${targetCurrency} ${targetAmount}`);
            callback(err, data);
        });
    }

    transferToken({ to, amount }, callback) {
        console.log(`Transfering ${amount} of Netcoins to ${to}`);
        return ApiConnector.transferMoney({ to, amount }, (err, data) => {
            console.log(`Transfered ${amount} of Netcoins by ${this.username} to ${to}`);
            callback(err, data);
        });
    }
}

let stocks;

function getStocks(callback) {
    console.log(`Geting stocks...`);
    return ApiConnector.getStocks((err, data) => {
        callback(err, data);
    });
}

getStocks((err, data) => {
    if (err) {
        console.log(`Geting stocks error: ${err}`);
    } else {
        console.log(`Geted stocks!`);
    }
    stocks = data[99];
});

function main() {
    const Ivan = new Profile({
        username: 'ivan',
        name: { firstName: 'Ivan', lastName: 'Chernyshev' },
        password: 'ivanspass',
    });
    // сначала создаем и авторизуем пользователя
    Ivan.addUser((err, data) => {
        if (err) {
            console.error(`Error during account creation: ${err}`);
        } else {
            console.log(`addUser: OK`);
            Ivan.authorization((err, data) => {
                if (err) {
                    console.error(`Error during authorization: ${err}`);
                } else {
                    console.log(`authorization: OK`);
                    Ivan.addMoney({ currency: 'RUB', amount: 10000 }, (err, data) => {
                        if (err) {
                            console.error(`Error during adding money to Ivan: ${err}`);
                        } else {
                            console.log(`addMoney: OK`);
                            console.log(data);
                            console.log(stocks);
                            const targetCurrency = 'NETCOIN';
                            const fromCurrency = 'RUB';
                            const targetAmount = stocks[`${fromCurrency}_${targetCurrency}`] * data.wallet[fromCurrency];
                            Ivan.currencyСonversion({
                                fromCurrency,
                                targetCurrency,
                                targetAmount
                            }, (err, data) => {
                                if (err) {
                                    console.error(`Error conversion money: ${err}`);
                                } else {
                                    console.log(`conversionMoney: OK`);
                                    console.log(data);
                                    const netcoin = data.wallet['NETCOIN'];
                                    //создаем Петю
                                    const Petya = new Profile({
                                        username: 'petya',
                                        name: { firstName: 'Petya', lastName: 'Petrov' },
                                        password: 'petyapass',
                                    });
                                    //регистрируем Петю
                                    Petya.addUser((err, data) => {
                                        if (err) {
                                            console.error(`Error during account creation: ${err}`);
                                        } else {
                                            console.log(`addUser: OK`);
                                            const to = Petya.username;
                                            Ivan.transferToken({ to, amount: netcoin }, (err, data) => {
                                                if (err) {
                                                    console.log(`Error during transferToken: ${err}`);
                                                } else {
                                                    console.log(`transferToken: OK`);
                                                }
                                            })
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

main();