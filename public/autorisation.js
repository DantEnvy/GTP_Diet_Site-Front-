const BACKEND_URL = 'http://localhost:3000';

// Функция отправки данных на регистрацию
async function handleRegister(event) {
    event.preventDefault(); 

    // Берем правильные ID из твоего HTML
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
            alert(data.message || 'Ошибка регистрации'); 
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось связаться с сервером. Убедись, что бэкенд запущен!');
    }
}

// Функция для Входа (Логина)
async function handleLogin(event) {
    event.preventDefault();

    // Берем правильные ID из твоего HTML
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
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);

            alert('Вход выполнен!');
            window.location.href = 'Plate-page.html';
        } else {
            alert(data.message || 'Неверный логин или пароль');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось связаться с сервером');
    }
}
// Привязываем клики к кнопкам (это у тебя уже есть)
document.getElementById('reg-btn').addEventListener('click', handleRegister);
document.getElementById('login-btn').addEventListener('click', handleLogin);

// ДОБАВЬ ЭТО: Привязываем клик к кнопке выхода
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

// Сама функция выхода (если её еще не было в JS)
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    alert('Вы вышли из аккаунта');
    window.location.reload(); // Перезагрузит страницу, чтобы обновить интерфейс
}