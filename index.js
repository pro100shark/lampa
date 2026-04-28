(function () {
    console.log('!!! SKIPPER V8: ФИКС ОБЪЕКТА DATA !!!');

    var storageKey = 'lampa_skipper_v8_data';

    function getMovieId() {
        try {
            // В твоей версии это объект, а не функция
            var p = Lampa.Player;
            var d = (p.data && typeof p.data === 'object') ? p.data : p.opened_data;
            
            if (d && d.movie) {
                return d.movie.id || d.movie.title || 'unknown';
            }
            return 'unknown';
        } catch (e) {
            console.log('!!! SKIPPER: Ошибка поиска ID', e);
            return 'unknown';
        }
    }

    function getStorage() {
        try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); } 
        catch (e) { return {}; }
    }

    function savePoint(type) {
        var video = document.querySelector('.player-video__video');
        if (!video) return;

        var id = getMovieId();
        var db = getStorage();
        
        if (!db[id]) db[id] = {};
        db[id][type] = Math.floor(video.currentTime);
        
        localStorage.setItem(storageKey, JSON.stringify(db));
        
        if (window.Lampa && Lampa.Noty) {
            Lampa.Noty.show('Метка ' + (type === 'intro' ? 'начала' : 'финала') + ' сохранена');
        }
    }

    function doSkip(type) {
        var id = getMovieId();
        var saved = getStorage()[id];

        if (saved && saved[type]) {
            var video = document.querySelector('.player-video__video');
            if (video) {
                video.currentTime = saved[type];
                if (window.Lampa && Lampa.Noty) Lampa.Noty.show('Пропустили к метке');
            }
        } else {
            if (window.Lampa && Lampa.Noty) Lampa.Noty.show('Зажмите кнопку, чтобы запомнить время');
        }
    }

    function createButtons() {
        var player = $('.player-video');
        if (player.length && !$('.skip-container-v8').length) {
            
            var container = $('<div class="skip-container-v8" style="position:absolute; bottom:140px; right:30px; z-index:9999; display:flex; gap:10px;"></div>');
            var style = 'background:rgba(0,0,0,0.8); color:#ffc107; padding:12px 18px; border-radius:10px; cursor:pointer; font-weight:bold; border:2px solid #ffc107; font-size:14px;';
            
            var bIn = $('<div class="s-btn" style="' + style + '">В НАЧАЛО</div>');
            var bOut = $('<div class="s-btn" style="' + style + '">В КОНЕЦ</div>');

            container.append(bIn).append(bOut);
            player.append(container);

            bIn.on('click', function(e) { e.stopPropagation(); doSkip('intro'); });
            bOut.on('click', function(e) { e.stopPropagation(); doSkip('outro'); });

            var timer;
            $('.s-btn').on('mousedown touchstart', function() {
                var t = $(this).text().includes('НАЧАЛО') ? 'intro' : 'outro';
                timer = setTimeout(function() { savePoint(t); timer = null; }, 1500);
            }).on('mouseup mouseleave touchend', function() {
                if (timer) clearTimeout(timer);
            });
        }
    }

    setInterval(createButtons, 1000);
})();
