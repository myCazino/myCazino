var menu = (function($) {
    var $ulAnLogged = $('<ul id=pages></ul>');
    var $ulLogged = $('<ul id=pages></ul>');


    $ulAnLogged.append($('<li><a href="#/" data-src="assets/pages/index.html" data-js="assets/js/index.js">О приложении</a></li>'));
    $ulLogged.append($('<li><a href="#/" data-src="assets/pages/index.html" data-js="assets/js/index.js">О приложении</a></li>'));
    $ulLogged.append($('<li><a href="#/bandit">Однорукий бандит</a></li>'));

    var $li = $('<li class="logout"><a href="#">LogOut</a></li>');
    
    var $cab = $('<li><a href="#/cabinet" data-src="assets/pages/cabinet.html" data-js="assets/js/cabinet.js">Кабинет пользователя</a></li>');
    var $fortuna = $('<li><a href="#/fortuna" data-src="assets/pages/fortuna.html" data-js="assets/js/fortuna.js">Колесо фортуны</a></li>');
    //$li.append($('<a id="logOutHref">logOut</a>').on("click", function(e){e.preventDefault();}));
    $ulLogged.append($li);
    $ulLogged.append($fortuna);
    $ulLogged.append($cab);


    $ulAnLogged.append($([
        '<li><a href="#/author" data-src="assets/pages/author.html" data-js="assets/js/author.js">Авторизация</a></li>',
        '<li><a href="#/register" data-src="assets/pages/register.html" data-js="assets/js/register.js">Регистрация</a></li>',
    ].join('')));

    return {
        renderMenu: function() {
            var $ulR = $('ul[id=pages]');
            var userTokenIsValid = Backendless.UserService.isValidLogin();

            if (userTokenIsValid) {
                $ulR.replaceWith($ulLogged);
                $li.on("click", function() {
                    Backendless.UserService.logout(new Backendless.Async(userLoggedout, gotError));

                    function userLoggedout() {
                        //alert("logout");
                        menu.renderMenu();
                    }

                    function gotError(err) {
                        console.log(gotError)
                    }
                });
                window.location.hash = '#/';
            }
            else {
                $ulR.replaceWith($ulAnLogged);
                window.location.hash = '#/author';
            }
        }
    }
})(jQuery);
