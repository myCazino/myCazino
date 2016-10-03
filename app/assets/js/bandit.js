app.currentModule = {
	init: function($html) {
		var intervalIds = [];
		var carousels = [];
		var panelCount;
		var currentIndex;
		var userName = Backendless.UserService.getCurrentUser();
		var $divAmount = $html.find('#userAmount');

		$divAmount.text(findCategory()[0].amount);

		carousels.length = 0;

		$html.find('.carousel-wrapper').each(function() {
			var slider = $(this).bxSlider({
				mode: 'vertical',
				randomStart: true,
				touchEnabled: false,
				pager: false,
				controls: false,
				auto: true,
				autoStart: false,
				pause: 50,
				speed: 10
			});

			carousels.push(slider);
		});

		function runCarousels() {
			carousels.forEach(function(item) {
				item.startAuto();
			});
		}

		function stopCarousels() {
			carousels.forEach(function(item) {
				item.stopAuto();
			});
		}

		function setValuesToCarousels(results) {
			carousels.forEach(function(item, index) {
				item.goToSlide(results[index]);
			});
		}

		$('#banditBtn').on('click', function() {
			var oldCount = findCategory()[0].amount;
			var bet = $('#betBandit').val();

			if (checkBet(bet)) {
				if (oldCount >= bet) {
					runCarousels();
					var data = {
						"bet": $('#betBandit').val()
					};

					$.ajax({
						url: 'https://api.backendless.com/v1/data/bandit',
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
							stopCarousels();
							setValuesToCarousels([obj.slot1, obj.slot2, obj.slot3]);
							var bonus = obj['bonus'];
							var newCount = oldCount + bonus;
							$divAmount.text(newCount);
							
							if (newCount < oldCount) {
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
		});

		function checkBet(bet) {
			if (bet == null || bet == "") {
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
	}
};