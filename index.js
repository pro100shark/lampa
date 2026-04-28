(function () {
    'use strict';

    function LampaSkipper() {
        var storageKey = 'lampa_skipper_settings';

        // 1. Поиск панели управления (перебираем все варианты твоей версии)
        function getFooter() {
            return $('.player-controls__footer, .player-video__footer, .player-interface__footer');
        }

        // 2. Логика отрисовки кнопок
        this.render = function () {
            var footer = getFooter();
            
            if (footer.length && !$('.skip-intro-btn').length) {
                console.log('Skipper: Drawing buttons...');

                var btnStyle = 'margin-left: 10px; background: rgba(255,255,255,0.15); padding: 5px 12px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.2); font-size: 13px; font-weight: bold;';
                
                var btnIntro = $('<div class="player-video__button skip-intro-btn" style="' + btnStyle + '">ПРОПУСТИТЬ</div>');
                
                // Вставляем кнопку перед иконкой настроек
                footer.find('.player-video__button:last').before(btnIntro);

                // Клик или OK на пульте
                btnIntro.on('click', function () {
                    var video = Lampa.Player.video();
                    var data = Lampa.Player.data();
                    var saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
                    
                    if (saved[data.movie.id]) {
                        video.currentTime = saved[data.movie.id];
                        Lampa.Noty.show('Пропущено по твоей метке');
                    } else {
                        Lampa.Noty.show('Сначала зажми для сохранения');
                    }
                });

                // Долгое нажатие (Save)
                btnIntro.on('hover:long', function () {
                    var data = Lampa.Player.data();
                    var time = Math.floor(Lampa.Player.video().currentTime);
                    var saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
                    
                    saved[data.movie.id] = time;
                    localStorage.setItem(storageKey, JSON.stringify(saved));
                    Lampa.Noty.show('Время заставки сохранено!');
                });
            }
        };

        // Инициализация
        this.init = function () {
            var _this = this;
            // Каждую секунду проверяем, не открылся ли плеер
            setInterval(function() {
                _this.render();
            }, 1000);
            console.log('Skipper: Ready');
        };
    }

    // Запуск
    if (!window.lampa_skipper_loaded) {
        window.lampa_skipper_loaded = true;
        var skipper = new LampaSkipper();
        skipper.init();
    }
})();
