// Функция расчета BMR (Базовый обмен веществ)
function calculateBMR(age, height, weight, gender, activity) {
    const multipliers = { very_high: 1.9, high: 1.725, medium: 1.55, small: 1.375, low: 1.2 };
    
    // Формула Миффлина-Сан Жеора
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += (gender === 'male' ? 5 : -161);
    
    return bmr * (multipliers[activity] || 1.55);
}
/*
// Главная функция отправки
async function send() {
    // 1. Получаем данные из полей ввода
    const age = document.getElementById("age").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const allergy = document.getElementById("allergy").value;
    const health = document.getElementById("health").value;

    // Получаем выбранные радио-кнопки
    const genderEl = document.querySelector('input[name="gender"]:checked');
    const activityEl = document.querySelector('input[name="activity"]:checked');
    const gender = genderEl ? genderEl.value : 'male';
    const activity = activityEl ? activityEl.value : 'medium';

    // Проверка заполненности
    if (!age || !height || !weight) {
        alert("Будь ласка, заповніть вік, зріст та вагу!");
        return;
    }

    // 2. Рассчитываем показатели (чтобы отправить их в GPT)
    const bmrVal = calculateBMR(age, height, weight, gender, activity);
    
    // Коэффициенты для белков
    const proteinMult = { very_high: 2, high: 1.8, medium: 1.4, small: 1.2, low: 0.8 }[activity] || 1.4;
    
    const proteins = Math.round(weight * proteinMult);
    const fats = Math.round((0.3 * bmrVal) / 9);
    const carbs = Math.round((0.4 * bmrVal) / 4);
    const bmrRounded = Math.round(bmrVal);

    // 3. Собираем объект для отправки
    const data = {
        bmr: bmrRounded,
        carb: carbs,
        fat: fats,
        protein: proteins,
        allergy: allergy,
        health: health
    };

    // Показываем пользователю, что идет загрузка
    const resultDiv = document.getElementById("result");
    resultDiv.innerText = "Генеруємо дієту за допомогою ШІ... Зачекайте (це може зайняти 5-10 секунд)";
    resultDiv.style.color = "blue";

    try {
        // 4. Отправляем на сервер
        const res = await fetch("https://back-end-daij.onrender.com/api/diet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            const result = await res.json();
            // 5. Показываем ответ GPT
            resultDiv.innerText = result.diet;
            resultDiv.style.color = "black"; // Возвращаем цвет
            
            // Сохраняем, чтобы не пропало при обновлении
            localStorage.setItem('diet', result.diet);
        } else {
            resultDiv.innerText = "Помилка сервера. Спробуйте пізніше.";
            resultDiv.style.color = "red";
        }
    } catch (error) {
        console.error("Error:", error);
        resultDiv.innerText = "Не вдалося з'єднатися з сервером.";
        resultDiv.style.color = "red";
    }
}

// Восстановление диеты при перезагрузке страницы
window.addEventListener('load', () => {
    const savedDiet = localStorage.getItem('diet');
    if (savedDiet) {
        document.getElementById('result').innerText = savedDiet;
    }
});*/


// Главная функция отправки через Gemini API
async function send() {
    // 1. Получаем данные из полей ввода
    const age = document.getElementById("age").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const allergy = document.getElementById("allergy").value;
    const health = document.getElementById("health").value;

    // Получаем выбранные радио-кнопки
    const genderEl = document.querySelector('input[name="gender"]:checked');
    const activityEl = document.querySelector('input[name="activity"]:checked');
    const gender = genderEl ? genderEl.value : 'male';
    const activity = activityEl ? activityEl.value : 'medium';

    // Проверка заполненности
    if (!age || !height || !weight) {
        alert("Будь ласка, заповніть вік, зріст та вагу!");
        return;
    }

    // 2. Рассчитываем показатели
    const bmrVal = calculateBMR(age, height, weight, gender, activity);
    
    // Коэффициенты для белков
    const proteinMult = { very_high: 2, high: 1.8, medium: 1.4, small: 1.2, low: 0.8 }[activity] || 1.4;
    
    const proteins = Math.round(weight * proteinMult);
    const fats = Math.round((0.3 * bmrVal) / 9);
    const carbs = Math.round((0.4 * bmrVal) / 4);
    const bmrRounded = Math.round(bmrVal);

    // 3. Формируем текст запроса (Промпт) для Gemini
    // Мы просим модель действовать как диетолог
    const promptText = `
      Створи детальний план харчування (дієту) на один день, базуючись на наступних параметрах користувача:
      - Калорійність: ${bmrRounded} ккал
      - Білки: ${proteins} г
      - Жири: ${fats} г
      - Вуглеводи: ${carbs} г
      - Алергії: ${allergy || "немає"}
      - Проблеми зі здоров'ям: ${health || "немає"}
      
      Розпиши сніданок, обід, вечерю та перекуси. Вкажи приблизну вагу порцій. Відповідай українською мовою.
    `;

    // Элемент вывода
    const resultDiv = document.getElementById("result");
    resultDiv.innerText = "Генеруємо дієту за допомогою Gemini... Зачекайте...";
    resultDiv.style.color = "blue";

    // Твой API ключ (Вставь сюда НОВЫЙ ключ)
    const API_KEY = "AIzaSyCZeLQ__qoG1MaM5Oti7-MbWqSIGoa-3XA"; 

    try {
        // 4. Отправляем запрос в Google Gemini API
        // Используем модель gemini-1.5-flash (она быстрая и дешевая/бесплатная)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: promptText }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (response.ok && data.candidates && data.candidates.length > 0) {
            // 5. Получаем текст ответа
            const dietText = data.candidates[0].content.parts[0].text;
            
            // Отображаем
            resultDiv.innerText = dietText;
            resultDiv.style.color = "black";
            
            // Сохраняем в память
            localStorage.setItem('diet', dietText);
        } else {
            console.error("Gemini Error:", data);
            resultDiv.innerText = "Помилка отримання даних від ШІ.";
            resultDiv.style.color = "red";
        }

    } catch (error) {
        console.error("Network Error:", error);
        resultDiv.innerText = "Не вдалося з'єднатися з Google API.";
        resultDiv.style.color = "red";
    }
}