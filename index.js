(function () {
    console.log('!!! SKIPPER V5: ИЩУ ПРАВИЛЬНЫЙ СЛОЙ !!!');

    setInterval(function() {
        // Проверяем, что плеер открыт
        var is_open = typeof Lampa !== 'undefined' && Lampa.Player && Lampa.Player.opened;
        
        if (is_open) {
            // Главный контейнер плеера, который точно над видео, но внутри окна плеера
            var player_box = $('.player-video'); 
            
            if (player_box.length && !$('.skip-btn-final').length) {
                console.log('!!! SKIPPER: Слой найден, вставляю кнопку');

                // Создаем кнопку. 
                // position: absolute привяжет её к краям плеера
                var btn = $('<div class="skip-btn-final" style="position:absolute; bottom:120px; right:30px; z-index:999; background:rgba(255,193,7,0.8); color:#000; padding:12px 20px; border-radius:10px; cursor:pointer; font-weight:bold; box-shadow: 0 0 15px rgba(0,0,0,0.5); font-size:16px; border:2px solid #fff;">ПРОПУСТИТЬ 85с</div>');
                
                player_box.append(btn);

                btn.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var video = Lampa.Player.video();
                    if (video) {
                        video.currentTime += 85;
                        Lampa.Noty.show('Прыгнули через заставку');
                    }
                });
            }
        } else {
            // Чистим за собой, если плеер закрыт
            if ($('.skip-btn-final').length) {
                $('.skip-btn-final').remove();
            }
        }
    }, 1000);
})();
