app.currentModule = {
    init: function($html) {

        var userName = Backendless.UserService.getCurrentUser();
        var $divAmount = $html.find('#userAmount');

        function runCarousels() {
            carousels.forEach(function(item) {
                item.startAuto();
            });
        }

        function stopCarousels(results) {
            carousels.forEach(function(item, index) {
                var sliderOptions = $.extend({}, carouselOptions, {
                    startSlide: results[index],
                    randomStart: false
                })
                item.reloadSlider(sliderOptions);
            });
        }

        $('#rouletteBtn').on('click', function() {
            var win = null;
            var oldCount = findCategory()[0].amount;
            var num = $('#rollNum').val();
            var st = $('#rollSt').val();

            if (checkBet(num, st)) {
                if (oldCount >= st) {
                    // runCarousels();

                    var data = {
                        "bet": '"' + $('#rollNum').val() + ':' + $('#rollSt').val() + '"'
                    };

                    $.ajax({
                        url: 'https://api.backendless.com/v1/data/roulette',
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
                            render(obj.win);
                            // console.log(obj);

                            setTimeout(function() {
                                var bonus = obj['bonus'];
                                var newCount = oldCount + bonus;
                                $divAmount.text(newCount);

                                if (newCount < oldCount) {
                                    toastr.warning('Вы проиграли. Попробуйте ещё!');
                                }
                                else {
                                    toastr.info('Вы выиграли!');
                                }
                            }, 8000);
                        }
                    });
                }
                else {
                    alert("Ставка не может быть больше, чем у вас есть на счету!");
                }
            }
            else {
                alert('Вы не ввели номер ячейки или не сделали ставку');
            }

        });


        function checkBet(num, st) {
            if (num == null || num == "" || st == null || st == "") {
                return false;
            }
            else {
                return true;
            }
        }

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

        function render(vin) {
            document.getElementById('roulette').style.animation = 'rotation 8s ease-out 0s 1';
            document.getElementById('theBallWrapper').style.animation = 'rotationTheBall .3s linear infinite';
            document.getElementById('theBallWrapper').innerHTML = '<div id="theBall"></div>';

            setTimeout(function() {
                document.getElementById('theBallWrapper').className = "win-" + vin;
                document.getElementById('theBallWrapper').style.animation = '0';
            }, 1000);

            setTimeout(function() {
                document.getElementById('roulette').style.animation = '0';
            }, 8000);
        }

    }
};