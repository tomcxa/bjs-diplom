const router = require("express").Router();
const multer  = require('multer');
const upload = multer();

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync', {
    serialize: (data) => encrypt(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(decrypt(data))
  });

//запрос списка транзакций
router.get("/", upload.none(), function(request, response) {
    const db = low(new FileSync('db.json'));// получение БД
    //получение значения списка транзакций, для указанного счёта
    let transactions = db.get("transactions").filter({account_id: request.query.account_id}).value();
    //отправка ответа со списком транзакций
    console.log(transactions)
    response.json({ success: true, data: transactions });
});

router.post("/", upload.none(), function(request, response) {
    const db = low(new FileSync('db.json'));// получение БД
    let transactions = db.get("transactions");// получение всех транзакций
    const { _method } = request.body;// получение используемого HTTP метода
    if(_method == "DELETE"){// если метод DELETE...
        let { id } = request.body;// получение id из тела запроса
        let removingTransaction = transactions.find({id});// нахождение удаляемой транзакции
        if(removingTransaction.value()){// если значение транзакции существует...
            transactions.remove({id}).write();// удалить транзакцию и записать это в БД
            response.json({ success: true });// отправление ответа с успешностью
        }else{// если значение транзакции не существует...
            response.json({ success: false });// отправление ответа с неуспешностью
        }
    }
    if(_method == "PUT"){// если метод PUT...
        const { type, name, sum, account_id } = request.body;// получение значений из тела запроса
        // нахождение значения текущего пользователя
        let currentUser = db.get("users").find({isAuthorized: true}).value();
        if(!currentUser)// если текущего авторизованного пользователя нету
            //отправление ответа с ошибкой о необходимости авторизации
            response.json({ success: false, error:"Необходима авторизация" });
        else{// если авторизованный пользователь существует
            let currentUserId = currentUser.user_id;// получить id текущего пользователя
            //добавление существующей транзакцию к списку и записывание в БД
            transactions.push({ type:type.toUpperCase(), name, sum:+sum, account_id, user_id: currentUserId, created_at: new Date().toISOString()}).write();
            response.json({ success: true });// отправление ответа с успешностью
        }
    }
        
});

module.exports = router;