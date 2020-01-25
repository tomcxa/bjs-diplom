/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * Наследуется от AsyncForm
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно (в котором находится форма) в случае успеха,
   * а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit( options ) {
    Account.create(options, (err, response) => {
      try {
        if (!response.success) {
          throw new Error(`Ошибка создания счета: ${response.error}`);
        }
        const account = document.getElementById('new-account-form');
        App.getModal('createAccount').close();
        App.update();
        account.reset();
      } catch (error) {
        console.error(error);
      }
    });
  }
}
