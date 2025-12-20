// Функция расчета BMR (Базовый обмен веществ)
function calculateBMR(age, height, weight, gender, activity) {
    const multipliers = { very_high: 1.9, high: 1.725, medium: 1.55, small: 1.375, low: 1.2 };
    
    // Формула Миффлина-Сан Жеора
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += (gender === 'male' ? 5 : -161);
    
    return bmr * (multipliers[activity] || 1.55);
}


async function send() {
    // 1. Збір даних
    const age = document.getElementById("age").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const allergy = document.getElementById("allergy").value;
    const health = document.getElementById("health").value;

    const gender = document.querySelector('input[name="gender"]:checked')?.value || 'male';
    const activity = document.querySelector('input[name="activity"]:checked')?.value || 'medium';

    if (!age || !height || !weight) {
        alert("Будь ласка, заповніть вік, зріст та вагу!");
        return;
    }

    // 2. Розрахунки (клієнтська логіка)
    const bmrVal = calculateBMR(age, height, weight, gender, activity);
    const proteinMult = { very_high: 2, high: 1.8, medium: 1.4, small: 1.2, low: 0.8 }[activity] || 1.4;
    
    const requestData = {
        bmr: Math.round(bmrVal),
        protein: Math.round(weight * proteinMult),
        fat: Math.round((0.3 * bmrVal) / 9),
        carb: Math.round((0.4 * bmrVal) / 4),
        allergy: allergy,
        health: health
    };

    // UI: Показуємо завантаження
    const resultDiv = document.getElementById("result");
    resultDiv.innerText = "Звертаємось до сервера... Зачекайте...";
    resultDiv.style.color = "blue";

    try {
        // 3. Відправляємо дані на НАШ сервер (локальний або на Render)
        // Якщо запускаєте локально — використовуйте localhost
        const response = await fetch("https://gtp-diet-site-back.vercel.app/api/diet", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (response.ok && data.diet) {
            // 4. Відображаємо результат
            // Використовуємо marked, якщо підключили, або просто innerText
            if (typeof marked !== 'undefined') {
                resultDiv.innerHTML = marked.parse(data.diet);
            } else {
                resultDiv.innerText = data.diet;
            }
            resultDiv.style.color = "black";
            localStorage.setItem('diet', data.diet);
        } else {
            resultDiv.innerText = "Помилка сервера: " + (data.error || "Невідома помилка");
            resultDiv.style.color = "red";
        }

    } catch (error) {
        console.error("Fetch error:", error);
        resultDiv.innerText = "Не вдалося під'єднатися до сервера.";
        resultDiv.style.color = "red";
    }
}