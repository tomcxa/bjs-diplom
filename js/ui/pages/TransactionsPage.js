
/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    try {
      if (!element) {
        throw new Error("Переданного элемента не существует");
      }
      this.element = element;
      this.lastOptions = '';
      this.registerEvents();
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', event => {
      if (event.target.classList.contains('remove-account')) {
        this.removeAccount();
      }

      if (event.target.classList.contains('transaction__remove')) {
        this.removeTransaction(event.target.dataset.id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.update()
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      const ok = confirm('Удалить счет?');
      if (ok) {
        Account.remove(this.lastOptions.account_id, {}, (err, response) => {
          this.clear();
          App.update();
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update()
   * */
  removeTransaction(id) {
    const ok = confirm('Удалить операцию по счету?');
    if (ok) {
      Transaction.remove(id, {}, (err, response) => {
        try {
          if (response.success) {
            App.update();
          }

        } catch (error) {
          console.error(error);
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options) {
      this.lastOptions = options;
      const xhr = Account.get(options.account_id, {}, (err, response) => {
        try {
          const data = response.data;
          this.renderTitle(data.name);
          Transaction.list(options, (err, response) => {
            try {
              if (response.success) {
                this.renderTransactions(response.data);
              } else {
                throw new Error("Ошибка при получении списка тразакций" + response);
              }

            } catch (error) {
              console.error(error);
            }
          });
        } catch (error) {
          console.error(error);
        }
      });
      console.log(xhr)
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = '';
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const contentTitle = this.element.querySelector('.content-title');
    contentTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const formatStr = date.split(' ').join('T');
    const newDate = new Date(Date.parse(formatStr));

    return newDate.toLocaleString();
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const transactionHTML =
      `<!-- либо transaction_expense, либо transaction_income -->
      <div class="transaction transaction_${item.type} row">
          <div class="col-md-7 transaction__details">
            <div class="transaction__icon">
                <span class="fa fa-money fa-2x"></span>
            </div>
            <div class="transaction__info">
                <h4 class="transaction__title">${item.name}</h4>
                <!-- дата -->
                <div class="transaction__date">${this.formatDate(item.updated_at)}</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="transaction__summ">
            <!--  сумма -->
            ${item.sum} <span class="currency">₽</span>
            </div>
          </div>
          <div class="col-md-2 transaction__controls">
              <!-- в data-id нужно поместить id -->
              <button class="btn btn-danger transaction__remove" data-id=${item.id}>
                  <i class="fa fa-trash"></i>  
              </button>
          </div>
      </div>`;

    return transactionHTML;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    let transactionTemplate = '';
    const content = this.element.querySelector('.content');

    data.forEach(item => {
      transactionTemplate += this.getTransactionHTML(item);
    });

    content.innerHTML = transactionTemplate;
  }
}
