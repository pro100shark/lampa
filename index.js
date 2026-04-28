(function () {
    'use strict';

    console.log('Skipper: Скрипт запущен');

    function addButtons() {
        // Ищем нижнюю панель плеера
        var footer = $('.player-controls__footer, .player-video__footer');
        
        // Если нашли панель и кнопок еще нет
        if (footer.length > 0 && $('.skip-intro-btn').length === 0) {
            console.log('Skipper: Рисую кнопку');

            var style = 'margin-left: 10px; background: rgba(255,255,255,0.2); padding: 6px 15px; border-radius: 5px; cursor: pointer; border: 1px solid rgba(255,255,255,0.3); font-size: 14px; color: #fff; font-weight: bold; display: inline-block;';
            
            var btn = $('<div class="skip-intro-btn" style="' + style + '">ПРОПУСТИТЬ</div>');
            
            // Ставим кнопку перед последним элементом в футере
            footer.append(btn);

            // Логика клика
            btn.on('click', function () {
                var video = Lampa.Player.video();
                var movie = Lampa.Player.data().movie;
                var storage = JSON.parse(localStorage.getItem('lampa_skipper_data') || '{}');
                
                if (storage[movie.id]) {
                    video.currentTime = storage[movie.id];
                    Lampa.Noty.show('Прыгнули на твою метку');
                } else {
                    Lampa.Noty.show('Зажми кнопку, чтобы запомнить время');
                }
            });

            // Логика сохранения (зажать кнопку)
            btn.on('contextmenu', function(e) { e.preventDefault(); }); // Для мыши
            
            // Специальный обработчик для Lampa (удержание)
            btn.on('hover:long', function() {
                var movie = Lampa.Player.data().movie;
                var time = Math.floor(Lampa.Player.video().currentTime);
                var storage = JSON.parse(localStorage.getItem('lampa_skipper_data') || '{}');
                
                storage[movie.id] = time;
                localStorage.setItem('lampa_skipper_data', JSON.stringify(storage));
                
                Lampa.Noty.show('Время сохранено для этого фильма!');
            });
        }
    }

    // Проверяем наличие плеера каждую секунду
    setInterval(addButtons, 1000);

})();
