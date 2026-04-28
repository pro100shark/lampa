(function () {
    console.log('!!! SKIPPER V3: ФИНАЛЬНЫЙ БРОСОК !!!');

    setInterval(function() {
        // Проверяем статус плеера через API Lampa
        var is_open = typeof Lampa !== 'undefined' && Lampa.Player && Lampa.Player.opened;
        
        if (is_open) {
            if (!$('.skip-btn-final').length) {
                console.log('!!! SKIPPER: Вижу плеер, создаю плавающую кнопку');
                
                // Создаем кнопку с фиксированным позиционированием
                var btn = $('<div class="skip-btn-final" style="position:fixed; bottom:20%; right:5%; z-index:999999; background:#ffc107; color:#000; padding:15px 25px; border-radius:50px; cursor:pointer; font-weight:bold; box-shadow: 0 0 20px rgba(0,0,0,1); font-size:18px; border:3px solid #fff; font-family: sans-serif; text-align:center;">ПРОПУСТИТЬ 85с</div>');
                
                $('body').append(btn);

                // Обработка клика
                btn.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var video = Lampa.Player.video();
                    if (video) {
                        video.currentTime += 85;
                        Lampa.Noty.show('Прыжок на 85 секунд');
                    }
                });
            }
        } else {
            // Если плеер закрыт — удаляем кнопку из документа
            if ($('.skip-btn-final').length) {
                $('.skip-btn-final').remove();
            }
        }
    }, 1000);
})();
