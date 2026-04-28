(function () {
    console.log('!!! SKIPPER V6: ПРЯМОЕ УПРАВЛЕНИЕ ВИДЕО !!!');

    setInterval(function() {
        var is_open = typeof Lampa !== 'undefined' && Lampa.Player && Lampa.Player.opened;
        
        if (is_open) {
            var video_element = document.querySelector('.player-video__video');
            var player_box = $('.player-video'); 
            
            if (video_element && player_box.length && !$('.skip-btn-final').length) {
                console.log('!!! SKIPPER: Видео найдено, ставлю кнопку');

                var btn = $('<div class="skip-btn-final" style="position:absolute; bottom:120px; right:30px; z-index:9999; background:rgba(255,193,7,0.9); color:#000; padding:12px 20px; border-radius:10px; cursor:pointer; font-weight:bold; box-shadow: 0 0 15px rgba(0,0,0,0.5); font-size:16px; border:2px solid #fff;">ПРОПУСТИТЬ 85с</div>');
                
                player_box.append(btn);

                btn.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    try {
                        // Прямое управление тегом <video>
                        var v = document.querySelector('.player-video__video');
                        if (v) {
                            v.currentTime += 85;
                            console.log('!!! SKIPPER: Прыжок выполнен успешно');
                            if (typeof Lampa.Noty !== 'undefined') Lampa.Noty.show('Пропустили 85 секунд');
                        } else {
                            console.log('!!! SKIPPER: Видео не найдено в момент клика');
                        }
                    } catch (err) {
                        console.error('!!! SKIPPER ERROR:', err);
                    }
                });
            }
        } else {
            if ($('.skip-btn-final').length) {
                $('.skip-btn-final').remove();
            }
        }
    }, 1000);
})();
