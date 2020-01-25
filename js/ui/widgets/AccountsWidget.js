/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    try {
      if (!element) {
        throw new Error("Переданного элемента не существует");
      }
      this.element = element;
      this.registerEvents();
      this.update();
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.addEventListener('click', event => {
      if (event.target.closest('.create-account')) {
        App.getModal('createAccount').open();
      }
      if (event.target.closest('.account')) {
        this.onSelectAccount(event.target.closest('.account'));
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const currentUser = User.current();
    if (currentUser) {

      Account.list(currentUser, (err, response) => {
        try {
          if (err) {
            throw new Error(err);
          }
          this.clear();
          this.renderItem(response.data);
        } catch (error) {
          console.error(error);
        }
      });
    }

  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = this.element.getElementsByClassName('account');

    [...accounts].forEach(account => account.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const accounts = this.element.getElementsByClassName('account');
    [...accounts].forEach(account => {
      if (account.classList.contains('active')) {
        account.classList.remove('active');
      }
    });

    element.classList.add('active');
    const account_id = element.dataset.id;
    App.showPage('transactions', { account_id});
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    let accountTemplate = '';
    item.forEach(el => {
      accountTemplate += `<li class="active account" data-id=${el.id}>
        <a href="#">
            <span>${el.name}</span> /
            <span>${el.sum}</span>
        </a>
      </li>`;
    });

    return accountTemplate;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(item) {
    const accountTemplate = this.getAccountHTML(item);
    this.element.insertAdjacentHTML('beforeend', accountTemplate);
  }
}
