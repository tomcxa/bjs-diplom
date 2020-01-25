/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const body = document.body;
    const sidebarToggle = body.querySelector('.sidebar-toggle');

    sidebarToggle.onclick = () => {
      body.classList.toggle('sidebar-open');
      body.classList.toggle('sidebar-collapse');
    }
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const sidebarMenu = document.querySelector('.sidebar-menu');

    sidebarMenu.addEventListener('click', event => {
      event.preventDefault();
      //если жмем на вход
      if (event.target.closest('.menu-item_login')) {
        const login = App.getModal('login');

        login.open();
      }
      if (event.target.closest('.menu-item_register')) {
        const register = App.getModal('register');

        register.open();
      }

      if (event.target.closest('.menu-item_logout')) {
        User.logout(null, (err, response) => {
          if (response.success) {
            App.setState('init');
          }
        });
      }
    });
  }
}
