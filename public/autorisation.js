const BACKEND_URL = 'http://localhost:3000'; // Порт 3000, как на сервере

// Функция отправки данных на регистрацию
async function handleRegister(event) {
    if (event) event.preventDefault(); // Останавливаем перезагрузку, если кнопка в форме

    // ИСПРАВЛЕНО: Берем правильные ID из HTML для регистрации
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if (!email || !password) {
        alert('Заполните все поля для регистрации');
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Ура! Регистрация успешна. Теперь войдите.');
        } else {
            alert(data.error || 'Ошибка регистрации'); 
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось связаться с сервером');
    }
}

// Функция для Входа (Логина)
async function handleLogin(event) {
    if (event) event.preventDefault();

    // ИСПРАВЛЕНО: Берем правильные ID из HTML для логина
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Заполните все поля для входа');
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Сохраняем токен и ID в память браузера
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);

            alert('Вход выполнен!');
            // Перенаправляем пользователя на главную страницу диеты
            window.location.href = 'Plate-page.html';
        } else {
            alert(data.error || 'Неверный логин или пароль');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось связаться с сервером');
    }
}

// Привязываем клики к кнопкам
document.getElementById('reg-btn').addEventListener('click', handleRegister);
document.getElementById('login-btn').addEventListener('click', handleLogin);