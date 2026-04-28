(function () {
    // Этот лог МЫ ДОЛЖНЫ увидеть в консоли первым делом
    console.log('!!! SKIPPER LOADED !!!');

    function createSkipButtons() {
        // Проверяем все возможные контейнеры для твоей версии
        var footer = $('.player-controls__footer, .player-video__footer, .player-interface__footer, .player-panel__footer');
        
        if (footer.length > 0 && !$('.lampa-skip-btn').length) {
            console.log('!!! SKIPPER: FOUND FOOTER, ADDING BUTTON !!!');
            
            var btn = $('<div class="lampa-skip-btn" style="display:inline-block; margin-left:20px; background:#fff; color:#000; padding:10px; cursor:pointer; font-weight:bold; border-radius:5px; z-index:999;">ПРОПУСТИТЬ</div>');
            
            footer.append(btn);

            btn.on('click', function() {
                var v = Lampa.Player.video();
                if (v) {
                    v.currentTime += 85; // Просто прыгаем на 85 сек для теста
                    Lampa.Noty.show('Прыжок на 85 секунд');
                }
            });
        }
    }

    // Запускаем проверку каждые 500мс
    setInterval(createSkipButtons, 500);
})();
