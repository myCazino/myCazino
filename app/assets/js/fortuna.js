app.currentModule = (function($) {
    return {
        init: function(obj, callback) {
            console.log("Инициализируем модуль колеса фортуны");

            obj = obj || new Object(null);
            callback = callback || function() {
                return false;
            };
            callback();


            /*-------------------------------------получаем имя и балланс -----------------------------------------------*/

            var userName = Backendless.UserService.getCurrentUser();

            var userCount = findCategory()[0].amount;
            console.log(userCount);

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


            /*-----------------Вставляем имя и балланс в DOM----------------------------*/
            var $nameF = obj.find('#nameF');
            var $countF = obj.find('#countF');
            $(document).ready(function() {
                $nameF.text('Дорогой вы наш ' + userName.name);
                $countF.text('Ваш балланс :' + userCount);
            });



            /*-----------------------------------отправка запроса----------------------------*/

            function randomInteger(min, max) {
                var rand = min + Math.random() * (max - min)
                rand = Math.round(rand);
                return rand;
            }

            function checkBet(bet) {
                if (bet == null || bet == "") {
                    return false;
                }
                else {
                    return true;
                }
            }

            
            $('#spin').on('click', function() {
                var win = randomInteger(360, 720);
                var oldCount = findCategory()[0].amount;
                var bet = $('#stavka').val();

                if (checkBet(bet)) {
                    if (oldCount >= bet) {

                        var data = {
                            "bet": $('#stavka').val()
                        };
                        $.ajax({
                            url: 'https://api.backendless.com/v1/data/fortune',
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
                                win = obj['win'] * 180;
                                var bonus = obj['bonus'];
                                var newCount = oldCount + bonus;
                                $countF.text('Ваш балланс: ' + newCount);
                                console.log(obj['bonus']);
                                //console.log(obj['win']);
                                //console.log(win);
                                //userCount += obj['bonus'];
                                console.log(userCount + obj['bonus']);
                                if (obj['bonus'] <= 0) {
                                    toastr.warning('Вы проиграли. Попробуйте ещё!');
                                }
                                else {
                                    toastr.info('Вы выиграли!');
                                }
                            }
                        });
                    }
                    else {
                        alert("Ставка не может быть больше, чем у вас есть на счету!");
                    }
                }
                else {
                    alert('Сделайте ставку!');
                }

                //$('#canvas').css('transform', 'rotate(360deg)');
                $('#canvas').css('transform', 'rotate(' + win + 'deg)');

            });
        }
    };
})(jQuery);