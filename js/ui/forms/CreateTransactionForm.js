/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * Наследуется от AsyncForm
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor( element ) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const currentUser = User.current();
    Account.list(currentUser, (err, response) => {
      const data = response.data;
      const accountsSelect = this.element.querySelector('.accounts-select');
      let options = '';
      data.forEach(obj => {
        options += `<option value="${obj.id}">${obj.name}</option>`;
      });
      accountsSelect.innerHTML = options;
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit( options ) {
    Transaction.create(options, (err, response) => {
      try {
        if (!response.success) {
          throw new Error(`Ошибка транзакции: ${response.error}`);
        }
       
       this.element.reset();
       App.getModal('newIncome').close();
       App.getModal('newExpense').close();
       App.update();
      } catch (error) {
        console.error("Error: ", error);
      } 
    });
  }
}
