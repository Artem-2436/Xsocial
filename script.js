// Этот код помести в скрипт основного сайта (после загрузки DOM)

document.addEventListener('DOMContentLoaded', () => {
    handleXCortexCallback();
});

function handleXCortexCallback() {
    const hash = window.location.hash.substring(1); // Убираем '#'
    const params = new URLSearchParams(hash);
    
    const token = params.get('token');
    
    if (token) {
        console.log("Получен токен от Xcortex ID!");
        
        // 1. Сохранение токена
        // Используем localStorage для хранения сессии на основном сайте
        localStorage.setItem('xcortex_access_token', token);
        
        // 2. Опционально: Можно сразу сделать запрос к API вашего основного бэкенда,
        // чтобы обменять этот токен на вашу собственную сессию/Cookie, 
        // если ваш основной сайт использует другую систему авторизации.
        // Пока что просто сохраним его.
        
        // 3. Очищаем URL от токена для безопасности
        // history.replaceState({}, document.title, window.location.pathname);
        window.history.replaceState(null, "", window.location.pathname);
        
        // 4. Обновляем UI (скрываем кнопку Login, показываем профиль)
        updateUIAfterLogin(token);
    } else {
        // Проверяем, есть ли сохраненный токен при обычном заходе
        const savedToken = localStorage.getItem('xcortex_access_token');
        if (savedToken) {
            updateUIAfterLogin(savedToken);
        }
    }
}

function updateUIAfterLogin(token) {
    // Пример: найти элемент кнопки "Sign in" и изменить её текст
    const signInBtn = document.querySelector('.btn-signin-xcortex');
    if (signInBtn) {
        signInBtn.style.display = 'none'; // Скрыть кнопку входа
        
        // Показать информацию о пользователе (нужно декодировать JWT или сделать запрос)
        // Для демо просто выведем сообщение
        const userInfoDiv = document.createElement('div');
        userInfoDiv.innerHTML = '<span style="color:green">✅ Авторизовано через Xcortex ID</span>';
        document.body.appendChild(userInfoDiv);
    }
}

// Функция выхода
function xcortexLogout() {
    localStorage.removeItem('xcortex_access_token');
    // Также можно вызвать signOut в Supabase, если используешь тот же клиент на основном сайте
    // supabase.auth.signOut(); 
    window.location.reload();
}
