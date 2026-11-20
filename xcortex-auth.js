/**
 * Xcortex Auth Helper
 * Подключи этот скрипт на любой сайт экосистемы.
 */

(function() {
    // ================= НАСТРОЙКИ =================
    // Куда вести пользователя для входа?
    const XCORTTEX_ID_PAGE = 'https://github.com/artem-2436/id.html'; // ЗАМЕНИ на адрес своего id.html
    
    // Данные Supabase (должны совпадать с теми, что в id.html)
    const SUPABASE_URL = 'https://ifsokgkfatghsxeoqofl.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_WlIcNs2dJz_Se_wJEXM-FA_5IFGi8OL';
    // =============================================

    let sbClient = null;

    // 1. Ждем загрузки библиотеки Supabase
    // Убедись, что на странице сайта уже есть: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    function init() {
        if (!window.supabase) {
            console.error("Ошибка: Библиотека Supabase не найдена. Добавь её в head сайта.");
            return;
        }
        sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        
        renderUI();
        checkHashTokens();
    }

    // 2. Рисуем кнопку или статус пользователя
    function renderUI() {
        // Удаляем старый контейнер, если был
        let container = document.getElementById('xcortex-widget');
        if (container) container.remove();

        container = document.createElement('div');
        container.id = 'xcortex-widget';
        container.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            font-family: sans-serif;
        `;
        document.body.appendChild(container);

        // Стили кнопки
        const btnStyle = `
            background: rgba(30,30,30,0.9); color: white; border: 1px solid #444;
            padding: 10px 20px; border-radius: 30px; cursor: pointer;
            backdrop-filter: blur(5px); display: flex; align-items: center; gap: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: 0.2s;
        `;

        sbClient.auth.getSession().then(({ data }) => {
            if (data.session) {
                // Пользователь вошел
                const user = data.session.user;
                const name = user.email.split('@')[0];
                container.innerHTML = `
                    <div style="${btnStyle}; cursor: default; border-color: #3b82f6;">
                        <span style="color:green">●</span> ${name}
                    </div>
                `;
                // Можно добавить событие, что пользователь готов
                window.dispatchEvent(new CustomEvent('xcortex-user-ready', { detail: user }));
            } else {
                // Пользователь НЕ вошел -> показываем кнопку входа
                container.innerHTML = `
                    <button onclick="window.XcortexAuth.login()" style="${btnStyle}">
                        Sign in via Xcortex
                    </button>
                `;
            }
        });
    }

    // 3. Обработка токенов из URL (после возвращения с id.html)
    function checkHashTokens() {
        const hash = window.location.hash;
        if (!hash.includes('#xcortex_access=')) return;

        try {
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('xcortex_access');
            const refreshToken = params.get('xcortex_refresh');

            if (accessToken && refreshToken) {
                console.log("Xcortex: Установка сессии из URL...");
                
                // Ставим сессию в Supabase
                sbClient.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
                .then(() => {
                    // Очищаем URL, убираем опасные токены из адресной строки
                    history.replaceState(null, '', window.location.pathname + window.location.search);
                    
                    // Обновляем интерфейс (покажем имя пользователя вместо кнопки)
                    renderUI();
                }).catch(err => {
                    console.error("Ошибка установки сессии:", err);
                    cleanHash();
                });
            }
        } catch (e) {
            console.error(e);
            cleanHash();
        }
    }

    function cleanHash() {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // Публичный метод для вызова из HTML (onclick)
    window.XcortexAuth = {
        login: () => {
            // Переходим на страницу входа, передавая текущий URL для возврата
            const currentUrl = encodeURIComponent(window.location.href);
            window.location.href = `${XCORTTEX_ID_PAGE}?redirect=${currentUrl}`;
        },
        logout: async () => {
            await sbClient.auth.signOut();
            location.reload();
        }
    };

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();/**
 * Xcortex Auth Helper
 * Подключи этот скрипт на любой сайт экосистемы.
 */

(function() {
    // ================= НАСТРОЙКИ =================
    // Куда вести пользователя для входа?
    const XCORTTEX_ID_PAGE = 'https://github.com/artem-2436/id.html'; // ЗАМЕНИ на адрес своего id.html
    
    // Данные Supabase (должны совпадать с теми, что в id.html)
    const SUPABASE_URL = 'https://ifsokgkfatghsxeoqofl.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_WlIcNs2dJz_Se_wJEXM-FA_5IFGi8OL';
    // =============================================

    let sbClient = null;

    // 1. Ждем загрузки библиотеки Supabase
    // Убедись, что на странице сайта уже есть: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    function init() {
        if (!window.supabase) {
            console.error("Ошибка: Библиотека Supabase не найдена. Добавь её в head сайта.");
            return;
        }
        sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        
        renderUI();
        checkHashTokens();
    }

    // 2. Рисуем кнопку или статус пользователя
    function renderUI() {
        // Удаляем старый контейнер, если был
        let container = document.getElementById('xcortex-widget');
        if (container) container.remove();

        container = document.createElement('div');
        container.id = 'xcortex-widget';
        container.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            font-family: sans-serif;
        `;
        document.body.appendChild(container);

        // Стили кнопки
        const btnStyle = `
            background: rgba(30,30,30,0.9); color: white; border: 1px solid #444;
            padding: 10px 20px; border-radius: 30px; cursor: pointer;
            backdrop-filter: blur(5px); display: flex; align-items: center; gap: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: 0.2s;
        `;

        sbClient.auth.getSession().then(({ data }) => {
            if (data.session) {
                // Пользователь вошел
                const user = data.session.user;
                const name = user.email.split('@')[0];
                container.innerHTML = `
                    <div style="${btnStyle}; cursor: default; border-color: #3b82f6;">
                        <span style="color:green">●</span> ${name}
                    </div>
                `;
                // Можно добавить событие, что пользователь готов
                window.dispatchEvent(new CustomEvent('xcortex-user-ready', { detail: user }));
            } else {
                // Пользователь НЕ вошел -> показываем кнопку входа
                container.innerHTML = `
                    <button onclick="window.XcortexAuth.login()" style="${btnStyle}">
                        Sign in via Xcortex
                    </button>
                `;
            }
        });
    }

    // 3. Обработка токенов из URL (после возвращения с id.html)
    function checkHashTokens() {
        const hash = window.location.hash;
        if (!hash.includes('#xcortex_access=')) return;

        try {
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('xcortex_access');
            const refreshToken = params.get('xcortex_refresh');

            if (accessToken && refreshToken) {
                console.log("Xcortex: Установка сессии из URL...");
                
                // Ставим сессию в Supabase
                sbClient.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
                .then(() => {
                    // Очищаем URL, убираем опасные токены из адресной строки
                    history.replaceState(null, '', window.location.pathname + window.location.search);
                    
                    // Обновляем интерфейс (покажем имя пользователя вместо кнопки)
                    renderUI();
                }).catch(err => {
                    console.error("Ошибка установки сессии:", err);
                    cleanHash();
                });
            }
        } catch (e) {
            console.error(e);
            cleanHash();
        }
    }

    function cleanHash() {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // Публичный метод для вызова из HTML (onclick)
    window.XcortexAuth = {
        login: () => {
            // Переходим на страницу входа, передавая текущий URL для возврата
            const currentUrl = encodeURIComponent(window.location.href);
            window.location.href = `${XCORTTEX_ID_PAGE}?redirect=${currentUrl}`;
        },
        logout: async () => {
            await sbClient.auth.signOut();
            location.reload();
        }
    };

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
