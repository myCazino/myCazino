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
            
            obj.find("input[type=button]").off("click").on("click", function() {
                var user = new Backendless.User();
                user.email = obj.find("input[name=mail]").val();
                user["password"] = obj.find("input[name=pass]").val();
                user.name = obj.find("input[name=first_name]").val();
                //Backendless.UserService.register(user);
                Backendless.UserService.register( user, new Backendless.Async( userRegistered, gotError ) );
            });
            
            function userRegistered(user) {
                console.log("user has been registered");
                alert("register is ok!");
            }
            
            function gotError(err) // see more on error handling
            {
                console.log("error message - " + err.message);
                console.log("error code - " + err.statusCode);
            }
            callback();
        }
    }
})(jQuery);

    

