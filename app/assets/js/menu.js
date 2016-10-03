var menu = (function($) {
    var $menuLeft = $('#pages');
    var $menuRight = $('ul#account');
    
    $menuRight.on("click", '.logout', function() {
        Backendless.UserService.logout(new Backendless.Async(userLoggedout, gotError));
    
        function userLoggedout() {
            menu.renderMenu();
        }
    
        function gotError(err) {
            console.log(gotError)
        }
    });

    return {
        renderMenu: function() {
            var userTokenIsValid = Backendless.UserService.isValidLogin();

            if (userTokenIsValid) {
                $menuLeft.html(`
                    <li><a href="#/" data-src="assets/pages/index.html" data-js="assets/js/index.js">О приложении</a></li>
                    <li><a href="#/bandit">Однорукий бандит</a></li>
                    <li><a href="#/fortuna" data-src="assets/pages/fortuna.html" data-js="assets/js/fortuna.js">Колесо фортуны</a></li>
                `);
                
                $menuRight.html(`
                    <li><a href="#/cabinet" data-src="assets/pages/cabinet.html" data-js="assets/js/cabinet.js">Кабинет пользователя</a></li>
                    <li class="logout"><a href="#">LogOut</a></li>
                `);
                
                window.location.hash = '#/';
            }
            else {
                $menuRight.empty();
                $menuLeft.html(`
                    <li><a href="#/" data-src="assets/pages/index.html" data-js="assets/js/index.js">О приложении</a></li>
                    <li><a href="#/author" data-src="assets/pages/author.html" data-js="assets/js/author.js">Авторизация</a></li>
                    <li><a href="#/register" data-src="assets/pages/register.html" data-js="assets/js/register.js">Регистрация</a></li>
                `);
                window.location.hash = '#/author';
            }
        }
    }
})(jQuery);
