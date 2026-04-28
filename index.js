(function () {
    console.log('!!! SKIPPER V11: АДАПТИВНОЕ ПОЯВЛЕНИЕ !!!');

    var storageKey = 'lampa_skipper_v11_data';
    var isShownForThisSession = false;
    var lastMovieId = '';

    function getMovieId() {
        try {
            var p = Lampa.Player, d = (p.data && typeof p.data === 'object') ? p.data : p.opened_data;
            return (d && d.movie) ? (d.movie.id || d.movie.title || 'unknown') : 'unknown';
        } catch (e) { return 'unknown'; }
    }

    function saveIntro() {
        var video = document.querySelector('.player-video__video');
        if (!video) return;
        var id = getMovieId();
        var db = JSON.parse(localStorage.getItem(storageKey) || '{}');
        if (!db[id]) db[id] = {};
        db[id].intro = Math.floor(video.currentTime);
        localStorage.setItem(storageKey, JSON.stringify(db));
        Lampa.Noty.show('Точка пропуска сохранена');
    }

    function skipIntro() {
        var id = getMovieId();
        var saved = JSON.parse(localStorage.getItem(storageKey) || '{}')[id];
        var video = document.querySelector('.player-video__video');
        if (video && saved && saved.intro) {
            video.currentTime = saved.intro;
            Lampa.Noty.show('Пропущено');
            $('.skip-btn-v11').fadeOut(300);
        }
    }

    function monitor() {
        var video = document.querySelector('.player-video__video');
        var player = $('.player-video');
        if (!video || !player.length) {
            isShownForThisSession = false;
            lastMovieId = '';
            $('.skip-btn-v11').remove();
            return;
        }

        var currentId = getMovieId();
        if (lastMovieId !== currentId) {
            lastMovieId = currentId;
            isShownForThisSession = false;
        }

        var db = JSON.parse(localStorage.getItem(storageKey) || '{}');
        var savedTime = (db[currentId] && db[currentId].intro) ? db[currentId].intro : null;
        var currentTime = Math.floor(video.currentTime);

        // ЛОГИКА ПОЯВЛЕНИЯ:
        // 1. Если метки нет — показываем в первые 20 сек видео, чтобы человек мог её создать.
        // 2. Если метка есть — показываем за 10 сек до этой метки и убираем через 5 сек после.
        var shouldShow = false;
        if (!savedTime) {
            if (currentTime < 20) shouldShow = true;
        } else {
            if (currentTime >= (savedTime - 10) && currentTime <= (savedTime + 2)) {
                shouldShow = true;
            }
        }

        if (shouldShow && !$('.skip-btn-v11').length && !isShownForThisSession) {
            var btn = $('<div class="skip-btn-v11" style="position:absolute; bottom:140px; right:30px; z-index:9999; background:rgba(0,0,0,0.85); color:#ffc107; padding:12px 20px; border-radius:10px; cursor:pointer; font-weight:bold; border:2px solid #ffc107; font-size:16px; box-shadow:0 0 15px rgba(0,0,0,0.5);">ПРОПУСТИТЬ ИНТРО</div>');
            player.append(btn);

            btn.on('click', function(e) {
                e.stopPropagation();
                skipIntro();
                isShownForThisSession = true; // Больше не показываем в этой серии
            });

            var timer;
            btn.on('mousedown touchstart', function() {
                timer = setTimeout(saveIntro, 1500);
            }).on('mouseup mouseleave touchend', function() {
                clearTimeout(timer);
            });
        }

        // Авто-удаление, если время вышло
        if (!shouldShow && $('.skip-btn-v11').length) {
            $('.skip-btn-v11').fadeOut(500, function() { 
                $(this).remove();
                // Если мы прошли точку сохраненного интро, помечаем сессию как "показанную"
                if (savedTime && currentTime > savedTime) isShownForThisSession = true;
            });
        }
    }

    setInterval(monitor, 1000);
})();
