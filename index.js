(function () {
    console.log('!!! SKIPPER V3: ПОЕХАЛИ !!!');

    setInterval(function() {
        // Проверяем, открыт ли плеер через API Lampa
        var is_open = typeof Lampa !== 'undefined' && Lampa.Player && Lampa.Player.opened;
        
        if (is_open && !$('.skip-btn-final').length) {
            console.log('!!! SKIPPER: Плеер вижу, кнопку ставлю !!!');
            
            // Создаем кнопку и вешаем её поверх всего в правом нижнем углу
            var btn = $('<div class="skip-btn-final" style="position:fixed; bottom:120px; right:50px; z-index:9999; background:#ffc107; color:#000; padding:15px 25px; border-radius:50px; cursor:pointer; font-weight:bold; box-shadow: 0 4px 15px rgba(0,0,0,0.5); font-size:18px;">ПРОПУСТИТЬ 85с</div>');
            
            $('body').append(btn);

            btn.on('click', function() {
                var video = Lampa.Player.video();
                if (video) {
                    video.currentTime += 85;
                    Lampa.Noty.show('Прыгнули на 85 секунд');
                }
            });
        }

        // Если плеер закрыли — удаляем кнопку
        if (!is_open && $('.skip-btn-final').length) {
            $('.skip-btn-final').remove();
        }
    }, 1000);
})();
