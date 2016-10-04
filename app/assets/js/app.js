var app = (function ($, cont) {

	var initialized = false; // флаг, инициализировано наше приложение или нет
	var $window = $(window); // ссылка на объект window, чтобы вызывать постоянно jquery

	// ассоциативный массив с описаием страниц src - адрес подгружаемого html, js - адрес подгружаемого js, ключ - hash
	var massPages = [
		{
			href: "#/",
			src: "assets/pages/index.html",
			js: "assets/js/index.js"
		},
		{
			href: "#/register",
			src: "assets/pages/register.html",
			js: "assets/js/register.js"
		},
		{
			href: "#/author",
			src: "assets/pages/author.html",
			js: "assets/js/author.js"
		},
		{
			href: "#/cabinet",
            src: "assets/pages/cabinet.html",
            js: "assets/js/cabinet.js"
		},
		{
			href: "#/fortuna",
            src: "assets/pages/fortuna.html",
            js: "assets/js/fortuna.js"
		},
		{
			href: "#/bandit",
			src: "assets/pages/bandit.html",
			js: "assets/js/bandit.js"
			
		},
		{
			href: "#/roulette",
			src: "assets/pages/roulette.html",
			js: "assets/js/roulette.js"
			
		}];
	var pages = {};

	var renderState = function (html) {
		cont.html(html);
	}


	Backendless.initApp("6CA711E3-8C59-332A-FF93-4CCC2831BC00", "E8F18971-2D25-7AC8-FFB9-6C96C62FD200", "v1");

	var changeState = function (e) {
		// записываем текущее состояние в state
		app.state = pages[window.location.hash];

		//$('.selectMeny').removeClass('selectMeny');
		//$('ul>li>a[href="'+window.location.hash+'"]').addClass('selectMeny');

		// вот тут может выдаваться ошибка "Cannot read property 'init' of undefined".
		// подумайте, почему происходит ошибка и как от этого можно избавиться?
		renderState(app.state.html);
		app.state.module.init(app.state.html);
		app.menu();
	}

	return {
		init: function () {
			//menu.renderMenu();

			app.menu = function () {
				console.log("menu");
			}
			var x = [];
			//$(cont.data('pages')).find('li>a').each(function() {
			massPages.forEach(function (item) {
				//var href = $(this).attr("href");
				var href = item.href;

				pages[href] = {
					//src: $(this).data("src"),
					src: item.src,
					//js: $(this).data("js"),
					js: item.js,
				};

				x[x.length] = $.ajax({
					url: pages[href].src,
					method: "GET",
					dataType: "html",
					success: function (html) {
						pages[href].html = $(html); // подумайте, почему так?

					}
				});
				x[x.length] = $.ajax({
					url: pages[href].js,
					method: "GET",
					dataType: "script",
					success: function (js) {
						pages[href].module = app.currentModule;
					}
				});
			});

			this.state = {} // текущее состояние
			window.location.hash = window.location.hash || "#/";
			$.when.apply($, x).then(function () {
				menu.renderMenu();
				$window.on('hashchange', changeState);
				if (!initialized) {
					$window.trigger('hashchange');
				}
				initialized = true;
			})

		},

		debug: function () {
			console.log(pages);
		},

		conf: {
			appId: "6CA711E3-8C59-332A-FF93-4CCC2831BC00",
			jsSecretKey: "E8F18971-2D25-7AC8-FFB9-6C96C62FD200",
			version: "v1"
		}

	}


})(jQuery, $('#app'));

app.init();