/**
 * Класс LoginForm управляет формой
 * входа в портал
 * Наследуется от AsyncForm
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit( options ) {
    User.login(options, (err, response) => {
      try {
        if (!response.success) {
          throw new Error(`Ошибка входа: ${response.error}`);
        }
        const login = document.getElementById('login-form');
        login.reset();
        App.setState( 'user-logged' );
        App.getModal('login').close();
      } catch (error) {
        console.error(error);
      }
    });
  }
}
