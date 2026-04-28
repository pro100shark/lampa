(function () {
    console.log('!!! SKIPPER V7: ЗАЩИТА ОТ ОШИБОК !!!');

    var storageKey = 'lampa_skipper_data_v2';

    function getMovieId() {
        try {
            var data = Lampa.Player.data();
            // Пробуем взять ID, если нет - название, если нет - заглушку
            return (data.movie && (data.movie.id || data.movie.title)) || 'unknown_movie';
        } catch (e) {
            return 'unknown_movie';
        }
    }

    function getStorage() {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || '{}');
        } catch (e) {
            return {};
        }
    }

    function savePoint(type) {
        try {
            var video = document.querySelector('.player-video__video');
            if (!video) return;

            var id = getMovieId();
            var db = getStorage();
            
            if (!db[id]) db[id] = {};
            db[id][type] = Math.floor(video.currentTime);
            
            localStorage.setItem(storageKey, JSON.stringify(db));
            
            if (window.Lampa && Lampa.Noty) {
                Lampa.Noty.show('Метка сохранена: ' + db[id][type] + 'с');
            }
            console.log('!!! SKIPPER: Сохранено для ' + id + ' тип ' + type);
        } catch (err) {
            console.error('!!! SKIPPER SAVE ERROR:', err);
        }
    }

    function doSkip(type) {
        try {
            var id = getMovieId();
            var saved = getStorage()[id];

            if (saved && saved[type]) {
                var video = document.querySelector('.player-video__video');
                if (video) {
                    video.currentTime = saved[type];
                    if (window.Lampa && Lampa.Noty) Lampa.Noty.show('Прыжок выполнен');
                }
            } else {
                if (window.Lampa && Lampa.Noty) Lampa.Noty.show('Метка не найдена. Зажмите кнопку для сохранения');
            }
        } catch (err) {
            console.error('!!! SKIPPER SKIP ERROR:', err);
        }
    }

    function createButtons() {
        try {
            var player = $('.player-video');
            if (player.length && !$('.skip-container').length) {
                var container = $('<div class="skip-container" style="position:absolute; bottom:140px; right:30px; z-index:9999; display:flex; gap:10px;"></div>');
                
                var btnStyle = 'background:rgba(0,0,0,0.8); color:#ffc107; padding:12px 18px; border-radius:10px; cursor:pointer; font-weight:bold; border:2px solid #ffc107; font-size:14px; text-shadow: 1px 1px 2px #000;';
                
                var btnIntro = $('<div class="skip-btn" style="' + btnStyle + '">В НАЧАЛО</div>');
                var btnOutro = $('<div class="skip-btn" style="' + btnStyle + '">В КОНЕЦ</div>');

                container.append(btnIntro).append(btnOutro);
                player.append(container);

                btnIntro.on('click', function(e) { e.stopPropagation(); doSkip('intro'); });
                btnOutro.on('click', function(e) { e.stopPropagation(); doSkip('outro'); });

                // Улучшенный обработчик долгого нажатия
                var timer;
                $('.skip-btn').on('mousedown touchstart', function(e) {
                    var type = $(this).text().includes('НАЧАЛО') ? 'intro' : 'outro';
                    timer = setTimeout(function() { 
                        savePoint(type); 
                        timer = null;
                    }, 1500);
                }).on('mouseup mouseleave touchend', function() {
                    if (timer) clearTimeout(timer);
                });
            }
        } catch (e) {}
    }

    setInterval(createButtons, 1000);
})();
