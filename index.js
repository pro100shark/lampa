(function () {
    console.log('!!! SKIPPER: Скрипт запущен и работает !!!');

    function addButtons() {
        // Проверяем, открыт ли вообще плеер
        var isPlayerOpen = Lampa.Player && Lampa.Player.opened;
        
        // Пытаемся найти футер разными способами
        var footer = $('.player-video__footer, .player-controls__footer, .player-panel__footer, .player-interface__footer');
        
        if (footer.length > 0) {
            if (!$('.skip-btn-new').length) {
                console.log('!!! SKIPPER: Нашел панель плеера! Рисую кнопку...');
                
                var style = 'margin-left:20px; background:rgba(255,255,255,0.2); padding:10px 20px; border-radius:8px; cursor:pointer; display:inline-block; font-weight:bold; color:#fff; border:2px solid #fff;';
                var btn = $('<div class="skip-btn-new" style="' + style + '">ПРОПУСТИТЬ +85с</div>');
                
                footer.append(btn);

                btn.on('click', function() {
                    console.log('!!! SKIPPER: Нажата кнопка пропуска');
                    var v = Lampa.Player.video();
                    if (v) {
                        v.currentTime += 85; 
                        Lampa.Noty.show('Пропустили заставку');
                    }
                });
            }
        } else if (isPlayerOpen) {
            // Если плеер открыт, но футер не найден — значит названия классов другие
            console.log('!!! SKIPPER: Плеер открыт, но панель (footer) не найдена. Ищу другие элементы...');
        }
    }

    // Проверка каждую секунду
    setInterval(addButtons, 1000);
})();
