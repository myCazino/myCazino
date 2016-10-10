app.currentModule = (function($) {
    return {
        init: function(obj, callback) {
            console.log("Инициализируем модуль регистрации");
            //var APPLICATION_ID = '24E6FCCB-4B67-AE1A-FF55-22A9CE465E00',
            //SECRET_KEY = '897CAEFC-92BA-3EE7-FFE0-B9160A48B700',
            //VERSION = 'v1'; //default application version;
            //Backendless.initApp(app.conf.appId, app.conf.jsSecretKey, app.conf.version);
            obj = obj || new Object(null);
            callback = callback || function() {
                return false;
            }
            
            $('#exampleInputPassword1').keydown(function(eventObject) {
                if (eventObject.which == 13) {
                    var user = new Backendless.User();
                    user.email = obj.find("input[name=mail]").val();
                    user["password"] = obj.find("input[name=pass]").val();
                    user.name = obj.find("input[name=first_name]").val();
                    Backendless.UserService.register(user, new Backendless.Async(userRegistered, gotError));
                }
            });

            obj.find("#registerBtn").off("click").on("click", function() {
                var user = new Backendless.User();
                user.email = obj.find("input[name=mail]").val();
                user["password"] = obj.find("input[name=pass]").val();
                user.name = obj.find("input[name=first_name]").val();
                Backendless.UserService.register(user, new Backendless.Async(userRegistered, gotError));
            });

            function userRegistered(user) {
                console.log("user has been registered");
                toastr.info('Вы зарегистрированы.');
                window.location.hash = '#/author';
            }

            function gotError(err) // see more on error handling
            {
                console.log("error message - " + err.message);
                console.log("error code - " + err.statusCode);
                toastr.error(err.message, 'Inconceivable!');
            }
            callback();
        }
    }
})(jQuery);
