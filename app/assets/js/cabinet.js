app.currentModule = (function($) {
    return {
        init: function(obj, callback) {
            console.log("Инициализируем модуль личного кабинета");
            //var APPLICATION_ID = '24E6FCCB-4B67-AE1A-FF55-22A9CE465E00',
            //SECRET_KEY = '897CAEFC-92BA-3EE7-FFE0-B9160A48B700',
            //VERSION = 'v1'; //default application version;
            //Backendless.initApp(app.conf.appId, app.conf.jsSecretKey, app.conf.version);
            obj = obj || new Object(null);
            callback = callback || function() {
                return false;
            }
            var userName = Backendless.UserService.getCurrentUser();

            var userCount = findCategory()[0].amount;
            console.log(userCount + 100);

            function findCategory() {
                var arrayOfItems = [];
                var itemsStorage = Backendless.Persistence.of('account');
                var dataQuery = {
                    condition: "ownerID = '" + userName.ownerId + "'"
                };

                var myCount = itemsStorage.find(dataQuery);
                $.each(myCount.data, function(i, item) {
                    arrayOfItems[arrayOfItems.length] = myCount.data[i];
                });
                
                return arrayOfItems;
            }
            
             // console.log(userCount);
            var name = obj.find('#name');
            var count = obj.find('#count');
            $(document).ready(function() {
                //console.log(userName);
                name.html(userName.name);
                count.html(userCount);
            });
            
            
            $('#appCount').on('click', function() {
                var countOld = findCategory()[0].amount;
                var countNew = countOld + 100;
                var data = {
                    "amount": countNew
                };
                $.ajax({
                    url: 'https://api.backendless.com/v1/data/account',
                    method: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    headers: {
                        'application-id': app.conf.appId,
                        'secret-key': app.conf.jsSecretKey,
                        'user-token': Backendless.LocalCache.get("user-token")
                    },
                    data: JSON.stringify(data),
                    success: function(obj) {
                        console.log(obj);
                        count.html(obj["amount"]);
                    }
                });
            });

            
            
            
            function account(args) {
                args = args || {};
                this.amount = args.amount || '';
                this.ownerId = args.ownerID || '';
                
             }
            var contactStorage = Backendless.Persistence.of( account );
            console.log(contactStorage.amount);
            // var updateAc = updateAccount();
            // function account(args) {
            //     args = args || {};
            //     this.amount = args.amount || '';
            //     this.ownerId = args.ownerID || '';
                
            // }
            // function updateAccount() {
            //     var accountObj = new account({
            //         amount: 100, 
            //         ownerID: userName.ownerId
            //     })
            //     var saveedAccount = Backendless.Persistence.of('account').update(accountObj);
            //     //console.log(accountStorage);
            //     saveedAccount['amount'] = 100;
            //     saveedAccount['ownerID'] = userName.ownerId;
            //   contactStorage.save(saveedAccount);
            // }





           

            obj.find("input[id=uppBalans]").off("click").on("click", function() {
                // var user = new Backendless.User();
                //user.name = obj.find("input[name=first_name]").val();
                // var zzz = Backendless.UserService.login(email,pass, true, new Backendless.Async( userLoggedIn, gotError ) );
                //console.log(user);
            });

            function userLoggedIn(user) {
                console.log("user has been authorised");
                menu.renderMenu();
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