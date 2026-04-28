(function () {
    function AdvancedSkipPlugin() {
        var storage_key = 'lampa_advanced_skip';
        
        var getStorage = function() {
            try { return JSON.parse(localStorage.getItem(storage_key) || '{}'); } 
            catch(e) { return {}; }
        };

        this.create = function () {
            Lampa.Player.listener.follow('view', (e) => {
                if (e.type == 'rentry' || e.type == 'ready') this.addButton();
            });
        };

        this.addButton = function () {
            var footer = $('.player-video__footer');
            if (footer.length && !$('.skip-intro-btn').length) {
                var btnIntro = $('<div class="player-video__button skip-intro-btn" style="margin-left:10px; background: rgba(50, 200, 50, 0.3); padding: 5px 12px; border-radius: 5px;">Пропуск заставки</div>');
                var btnOutro = $('<div class="player-video__button skip-outro-btn" style="margin-left:10px; background: rgba(200, 50, 50, 0.3); padding: 5px 12px; border-radius: 5px;">К титрам</div>');
                
                footer.append(btnIntro).append(btnOutro);

                // Логика для заставки (Intro)
                btnIntro.on('hover:enter', () => this.skipTo('intro'));
                btnIntro.on('hover:long', () => this.saveTime('intro'));

                // Логика для финальных титров (Outro)
                btnOutro.on('hover:enter', () => this.skipTo('outro'));
                btnOutro.on('hover:long', () => this.saveTime('outro'));
            }
        };

        this.skipTo = function (type) {
            var id = Lampa.Player.data().movie.id;
            var saved = getStorage()[id];
            if (saved && saved[type]) {
                Lampa.Player.video().currentTime = saved[type];
                Lampa.Noty.show('Прыжок: ' + (type == 'intro' ? 'Заставка' : 'Титры'));
            } else {
                Lampa.Noty.show('Удерживайте OK, чтобы запомнить время');
            }
        };

        this.saveTime = function (type) {
            var id = Lampa.Player.data().movie.id;
            var currentTime = Math.floor(Lampa.Player.video().currentTime);
            var db = getStorage();
            
            if (!db[id]) db[id] = {};
            db[id][type] = currentTime;
            
            localStorage.setItem(storage_key, JSON.stringify(db));
            Lampa.Noty.show('Сохранено для ' + (type == 'intro' ? 'заставки' : 'титров'));
        };
    }

    if (!window.advanced_skip_installed) {
        window.advanced_skip_installed = true;
        new AdvancedSkipPlugin().create();
    }
})();