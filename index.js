(function () {
    console.log('Skipper: Запуск проверки...');

    function addButtons() {
        // Проверяем наличие футера плеера
        var footer = $('.player-video__footer, .player-controls__footer');
        
        if (footer.length && !$('.skip-btn-new').length) {
            console.log('Skipper: Рисую кнопки');
            
            var style = 'margin-left:10px; background:rgba(255,255,255,0.2); padding:6px 12px; border-radius:4px; cursor:pointer; display:inline-block; font-size:12px; color:#fff; border:1px solid rgba(255,255,255,0.3);';
            
            var btn = $('<div class="skip-btn-new" style="' + style + '">ПРОПУСТИТЬ</div>');
            
            footer.append(btn);

            btn.on('click', function() {
                var v = Lampa.Player.video();
                if (v) {
                    v.currentTime += 85; 
                    Lampa.Noty.show('Пропустили 85 сек');
                }
            });
        }
    }

    // Проверяем каждую секунду, открыт ли плеер
    setInterval(addButtons, 1000);
})();
