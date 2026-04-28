(function () {
    console.log('!!! SKIPPER PRO: ЗАПУСК !!!');

    var storageKey = 'lampa_skipper_data';

    function getStorage() {
        try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); } 
        catch (e) { return {}; }
    }

    function savePoint(type) {
        var video = document.querySelector('.player-video__video');
        if (!video) return;

        var movie = Lampa.Player.data().movie;
        var id = movie.id;
        var db = getStorage();
        
        if (!db[id]) db[id] = {};
        db[id][type] = Math.floor(video.currentTime);
        
        localStorage.setItem(storageKey, JSON.stringify(db));
        Lampa.Noty.show('Сохранено для ' + (type === 'intro' ? 'начала' : 'финала'));
    }

    function doSkip(type) {
        var movie = Lampa.Player.data().movie;
        var saved = getStorage()[movie.id];

        if (saved && saved[type]) {
            var video = document.querySelector('.player-video__video');
            if (video) {
                video.currentTime = saved[type];
                Lampa.Noty.show('Пропущено к метке');
            }
        } else {
            Lampa.Noty.show('Сначала зажмите кнопку, чтобы сохранить время');
        }
    }

    function createButtons() {
        var player = $('.player-video');
        if (player.length && !$('.skip-container').length) {
            
            var container = $('<div class="skip-container" style="position:absolute; bottom:130px; right:30px; z-index:9999; display:flex; gap:10px;"></div>');
            
            var btnStyle = 'background:rgba(0,0,0,0.7); color:#fff; padding:10px 15px; border-radius:8px; cursor:pointer; font-weight:bold; border:1px solid rgba(255,255,255,0.3); font-size:14px;';
            
            var btnIntro = $('<div style="' + btnStyle + '">В НАЧАЛО</div>');
            var btnOutro = $('<div style="' + btnStyle + '">В КОНЕЦ</div>');

            container.append(btnIntro).append(btnOutro);
            player.append(container);

            // Клик — прыжок
            btnIntro.on('click', function() { doSkip('intro'); });
            btnOutro.on('click', function() { doSkip('outro'); });

            // Долгое нажатие — сохранение
            var timer;
            btnIntro.on('mousedown touchstart', function() {
                timer = setTimeout(function() { savePoint('intro'); }, 1500);
            }).on('mouseup mouseleave touchend', function() { clearTimeout(timer); });

            btnOutro.on('mousedown touchstart', function() {
                timer = setTimeout(function() { savePoint('outro'); }, 1500);
            }).on('mouseup mouseleave touchend', function() { clearTimeout(timer); });
        }
    }

    setInterval(createButtons, 1000);
})();
