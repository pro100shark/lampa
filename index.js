(function () {
    console.log('!!! SKIPPER V4: ПРИВЯЗКА К ТЕГУ VIDEO !!!');

    setInterval(function() {
        // Проверяем, открыт ли плеер в Lampa
        var is_open = typeof Lampa !== 'undefined' && Lampa.Player && Lampa.Player.opened;
        
        if (is_open) {
            // Находим именно тот тег, который ты скинул
            var video_tag = $('.player-video__video');
            var container = video_tag.parent();

            if (container.length && !$('.skip-btn-final').length) {
                console.log('!!! SKIPPER: Контейнер найден, монтирую кнопку');
                
                // Убеждаемся, что контейнер имеет позиционирование для работы absolute
                if (container.css('position') === 'static') {
                    container.css('position', 'relative');
                }

                // Создаем кнопку. Теперь она внутри плеера.
                // bottom: 15% и right: 5% — чтобы не перекрывала основные элементы управления
                var btn = $('<div class="skip-btn-final" style="position:absolute; bottom:15%; right:5%; z-index:999; background:rgba(0,0,0,0.6); color:#fff; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold; border:1px solid rgba(255,255,255,0.4); font-size:16px; white-space:nowrap;">ПРОПУСТИТЬ 85с</div>');
                
                container.append(btn);

                btn.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var v = Lampa.Player.video();
                    if (v) {
                        v.currentTime += 85;
                        Lampa.Noty.show('Пропустили заставку');
                    }
                });
            }
        } else {
            // Если плеер закрыт, удаляем кнопку, если она вдруг осталась
            if ($('.skip-btn-final').length) {
                $('.skip-btn-final').remove();
            }
        }
    }, 1000);
})();
