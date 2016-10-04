app.currentModule = {
    init: function($html) {

        var userName = Backendless.UserService.getCurrentUser();
        var $divAmount = $html.find('#userAmount');

        $divAmount.text(findCategory()[0].amount);

        $('#rouletteBtn').on('click', function() {
            var win = null;
            var oldCount = findCategory()[0].amount;
            var nums = $('#rollNum').val().split(',');
            console.log($('#rollNum').val());
            var sts = $('#rollSt').val().split(',');

            if (checkBet(nums, sts)) {

                var req = '';
                for (var i = 0; i < nums.length; i++) {
                    if (oldCount <= sts[i]) {
                        alert("Ставка не может быть больше, чем у вас есть на счету!");
                        return;
                    }
                    req = req + nums[i] + ':' + sts[i];
                    if (i + 1 < nums.length) req = req + ',';
                };

                var data = {
                    "bet": req
                };
                
                console.log(data);

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
                alert('Вы не ввели номер ячейки или не сделали ставку');
            }
        });


        function checkBet(num, st) {
            var res = false;
            console.log(num);
            if (num.length <= 37 && num.length == st.length) {
                for (var i = 0; i < num.length; i++) {

                    if (num[i] == null || num[i] == "" || st[i] == null || st[i] == "") {
                        res = false;
                    }
                    else if (isNaN(num[i]) || isNaN(st[i])) {
                        res = false;
                    }
                    else if (num[i] < 0 || num[i] > 36 || st[i] <= 0) {
                        res = false;
                    }
                    else {
                        res = true;
                    }
                }
            }
            return res;
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