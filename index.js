"use strict";

(() => {
    class LampaSkipper {
        constructor() {
            this.storageKey = 'lampa_skipper_data';
        }

        getStorage() {
            try {
                return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            } catch (e) {
                return {};
            }
        }

        init() {
            // Слушаем события плеера
            Lampa.Player.listener.follow('view', (e) => {
                // Добавляем задержку, чтобы футер успел появиться в DOM
                if (e.type === 'rentry' || e.type === 'ready' || e.type === 'init') {
                    setTimeout(() => {
                        this.renderButtons();
                    }, 500);
                }
            });
            console.log("Skipper: Инициализирован");
        }

        renderButtons() {
            // Ищем футер плеера (в разных версиях может быть разным)
            const footer = $('.player-video__footer, .player-controls__footer');
            
            if (footer.length && !$('.skip-btn--intro').length) {
                console.log("Skipper: Футер найден, рисую кнопки");

                const btnStyle = "margin-left:12px; background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; z-index: 10; pointer-events: all; border: 1px solid rgba(255,255,255,0.2);";

                const btnIntro = $(`<div class="player-video__button skip-btn--intro" style="${btnStyle}">Пропустить начало</div>`);
                const btnOutro = $(`<div class="player-video__button skip-btn--outro" style="${btnStyle}">Титры</div>`);

                footer.append(btnIntro).append(btnOutro);

                btnIntro.on('hover:enter click', () => this.handleSkip('intro'));
                btnIntro.on('hover:long', () => this.handleSave('intro'));

                btnOutro.on('hover:enter click', () => this.handleSkip('outro'));
                btnOutro.on('hover:long', () => this.handleSave('outro'));
            } else {
                console.log("Skipper: Футер не найден или кнопки уже есть");
            }
        }

        handleSkip(type) {
            const data = Lampa.Player.data();
            const id = data.movie.id;
            const savedPoints = this.getStorage()[id];

            if (savedPoints?.[type]) {
                Lampa.Player.video().currentTime = savedPoints[type];
                Lampa.Noty.show('Прыжок выполнен');
            } else {
                Lampa.Noty.show('Зажмите для сохранения');
            }
        }

        handleSave(type) {
            const id = Lampa.Player.data().movie.id;
            const currentTime = Math.floor(Lampa.Player.video().currentTime);
            const db = this.getStorage();

            if (!db[id]) db[id] = {};
            db[id][type] = currentTime;

            localStorage.setItem(this.storageKey, JSON.stringify(db));
            Lampa.Noty.show('Время сохранено!');
        }
    }

    if (!window.lampa_skipper_loaded) {
        window.lampa_skipper_loaded = true;
        const skipper = new LampaSkipper();
        skipper.init();
    }
})();
