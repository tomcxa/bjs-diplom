/**
 * Класс RegisterForm управляет формой
 * регистрации
 * Наследуется от AsyncForm
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(options) {
    User.register(options, (err, response) => {
      try {
        if (!response.success) {
          throw new Error('Ошибка регистрации: ' + response.error);
        } else {
          App.setState('user-logged');
          const register = App.getModal('register');
          const form = document.getElementById('register-form');
          form.reset();
          register.close();
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
}
