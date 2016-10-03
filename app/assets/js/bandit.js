app.currentModule = {
	init: function ($html) {
		var intervalIds = [];
		var carousels = [];
		var panelCount;
		var currentIndex;
		var userName = Backendless.UserService.getCurrentUser();
		
		carousels.length = 0;
		
		$html.find('.carousel').each(function() {
                var $this = $(this);
                panelCount = $this.children().length;

                $this.drum({
                    panelCount: panelCount,
                    dail_stroke_color: '#810000',
                    dail_stroke_width: 3,
                    interactive: false
                });
                currentIndex = 0;

                carousels.push($this);
                //runCarousel($this, currentIndex, panelCount);
            });
		
		
        function run() {
            carousels.forEach(function(item) {
                var $this = $(item);
                runCarousel($this, currentIndex, panelCount);
            })
        
        }
	

		function runCarousel($carousel, currentIndex, panelCount){
			var intervalId = setInterval(function () {
				currentIndex++;
				currentIndex = currentIndex == panelCount ? 0 : currentIndex;
				$carousel.drum('setIndex', currentIndex);
			}, Math.random() * 200);
			intervalIds.push(intervalId);
		}

		function stopCarousels(){
			intervalIds.forEach(function(intervalId){
				clearInterval(intervalId);
			});
			intervalIds = [];
		}
		
		$('#banditBtn').on('click', function(){
		    //runCarousel($this, currentIndex, panelCount);
		    run();
		    
		    var objForLocal = localStorage.getItem('Backendless');
		    console.log(objForLocal);
		    console.log(Backendless.LocalCache.get("user-token"));
		    //sendData["bet"] = $('#betBandit').val();
		    //sendData.push('bet:' + $('#betBandit').val());
		    //console.log(sendData);
		    var data = {
		        "bet": $('#betBandit').val()
		    };
		    console.log(JSON.stringify(data));
		    //var str = '{"bet":"' + $('#betBandit').val() + '"}';
		    //console.log(str);
		    //var jsonSendData = JSON.parse(str);
		    //console.log(jsonSendData);
		    
		    $.ajax({
		        url: 'https://api.backendless.com/v1/data/bandit',
		        method: "POST",
		        dataType: "json",
		        contentType: "application/json",
		        headers: {
		            'application-id': app.conf.appId,
		            'secret-key':  app.conf.jsSecretKey,
		            'user-token': Backendless.LocalCache.get("user-token")
		        },
		        data:JSON.stringify(data),
		        success: function (obj) {
						stopCarousels();
						console.dir(obj);
						console.log(obj['bonus']);
					}
		    });
		})
		
		
		var userCount = findCategory()[0].amount;
           //console.log(userCount + 100);

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
        
        var divAmount = $html.find('#user-amount');
        divAmount.html('Ваш баланс: ' + userCount);
		

	}
};