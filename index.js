"use strict";

(() => {
    class LampaSkipper {
        constructor() {
            this.storageKey = 'lampa_skipper_data';
        }

        /**
         * Получаем сохраненные метки из localStorage
         */
        getStorage() {
            try {
                return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            } catch (e) {
                console.error('Skipper: Ошибка чтения базы данных', e);
                return {};
            }
        }

        /**
         * Инициализация слушателей плеера Lampa
         */
        init() {
            Lampa.Player.listener.follow('view', (e) => {
                if (e.type === 'rentry' || e.type === 'ready') {
                    this.renderButtons();
                }
            });
        }

        /**
         * Отрисовка интерфейса кнопок
         */
        renderButtons() {
            const footer = $('.player-video__footer');
            
            // Если кнопки уже есть — ничего не делаем
            if (!footer.length || $('.skip-btn--intro').length) return;

            const createBtn = (type, label, color) => {
                return $(`<div class="player-video__button skip-btn--${type}" 
                    style="margin-left:12px; background: ${color}; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer;">
                    ${label}
                </div>`);
            };

            const btnIntro = createBtn('intro', 'Пропустить начало', 'rgba(46, 204, 113, 0.4)');
            const btnOutro = createBtn('outro', 'В конец серии', 'rgba(231, 76, 60, 0.4)');

            footer.append(btnIntro).append(btnOutro);

            // Обработка клика (короткое нажатие OK)
            btnIntro.on('hover:enter', () => this.handleSkip('intro'));
            btnOutro.on('hover:enter', () => this.handleSkip('outro'));

            // Обработка долгого нажатия (Long Press) для сохранения точки
            btnIntro.on('hover:long', () => this.handleSave('intro'));
            btnOutro.on('hover:long', () => this.handleSave('outro'));
        }

        /**
         * Прыжок на сохраненную точку
         */
        handleSkip(type) {
            const movieData = Lampa.Player.data();
            const id = movieData.movie.id;
            const savedPoints = this.getStorage()[id];

            if (savedPoints?.[type]) {
                Lampa.Player.video().currentTime = savedPoints[type];
                Lampa.Noty.show(`Прыжок: ${type === 'intro' ? 'Начало' : 'Финал'}`);
            } else {
                Lampa.Noty.show('Зажмите OK, чтобы запомнить время');
            }
        }

        /**
         * Сохранение текущей секунды в базу
         */
        handleSave(type) {
            const { movie } = Lampa.Player.data();
            const currentTime = Math.floor(Lampa.Player.video().currentTime);
            const db = this.getStorage();

            if (!db[movie.id]) db[movie.id] = {};
            db[movie.id][type] = currentTime;

            localStorage.setItem(this.storageKey, JSON.stringify(db));
            Lampa.Noty.show(`Время для ${type === 'intro' ? 'заставки' : 'титров'} сохранено!`);
        }
    }

    // Запуск плагина (проверка на дубликаты)
    if (!window.lampa_skipper_loaded) {
        window.lampa_skipper_loaded = true;
        const skipper = new LampaSkipper();
        skipper.init();
    }
})();
