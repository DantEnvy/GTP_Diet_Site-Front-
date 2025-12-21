// ===============================

// 1. Добавьте эту функцию в начало файла или перед её использованием
function formatDietToHtml(jsonString) {
    let data;
    try {
        // Пытаемся превратить строку от ИИ в объект
        data = typeof jsonString === 'object' ? jsonString : JSON.parse(jsonString);
    } catch (e) {
        return `<p>${jsonString}</p>`; // Если это не JSON, выводим как есть
    }

    let html = '';
    // Проходимся по каждому пункту (Завтрак, Обед и т.д.)
    for (const [key, value] of Object.entries(data)) {
        // Создаем красивые блоки, используя ваши стандартные стили заголовков и текста
        html += `
            <div style="margin-bottom: 20px;">
                <h3 style="text-transform: capitalize; color: inherit;">${key}</h3>
                <p style="white-space: pre-wrap;">${value}</p>
            </div>
        `;
    }
    return html;
}

// 2. Найдите место, где вы вставляете текст в окно диеты.
// Оно выглядит примерно так: dietOutput.innerText = response.message;
// ЗАМЕНИТЕ это на:


// РОЗРАХУНОК BMR
// ===============================
function calculateBMR(age, height, weight, gender, activity) {
    age = Number(age);
    height = Number(height);
    weight = Number(weight);

    const multipliers = {
        very_high: 1.9,
        high: 1.725,
        medium: 1.55,
        small: 1.375,
        low: 1.2
    };

    const base =
        (10 * weight) +
        (6.25 * height) -
        (5 * age) +
        (gender === "male" ? 5 : -161);

    return base * (multipliers[activity]); 
}

function vitam(age,gender,weight,activity){
    age=Number(age);
    weight=Number(weight);
    const multipliers={very_high:1.4,high:1.2,medium:1.1,small:1,low:0.8};
    const vitaminRDA={Vitamin_C:90,Vitamin_D:800,Vitamin_A:700,Vitamin_B1:1.1,Vitamin_B6:1.3,Vitamin_B12:2.4};
    const genderFactor={male:1,female:0.9};
    let ageFactor = age<=3?0.8:age<=8?0.9:age<=13?1:age<=18?1.1:age<=50?1:1.2;
    const activityMultiplier = multipliers[activity] ?? 1.1;
    const gFactor = genderFactor[gender] ?? 1;
    const weightFactor = (weight>0)?(weight/70):1;
    return {
    Vitamin_D: vitaminRDA.Vitamin_D * ageFactor * gFactor * activityMultiplier * weightFactor,
    Vitamin_C: vitaminRDA.Vitamin_C * ageFactor * gFactor * activityMultiplier * weightFactor,
    Vitamin_B12: vitaminRDA.Vitamin_B12 * ageFactor * gFactor * activityMultiplier * weightFactor,
    Vitamin_A: vitaminRDA.Vitamin_A * ageFactor * gFactor * activityMultiplier * weightFactor,
    Vitamin_B1: vitaminRDA.Vitamin_B1 * ageFactor * gFactor * activityMultiplier * weightFactor,
    Vitamin_B6: vitaminRDA.Vitamin_B6 * ageFactor * gFactor * activityMultiplier * weightFactor
    };
}

function prot(activity,weight){const m={very_high:2,high:1.8,medium:1.4,small:1.2,low:0.8}; return Number(weight)*(m[activity])}

// ===============================
// НАДСИЛАННЯ ДАНИХ НА БЕКЕНД
// ===============================
async function send() {
    const age = document.getElementById("age").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const gender = document.getElementById("gender").value;
    const activity = document.querySelector("input[name='activity']:checked")?.value;
    const allergy = document.getElementById("allergy").value;
    const health = document.getElementById("health").value;    

    if (!age || !height || !weight) {
        alert("Заповніть всі обовʼязкові поля!");
        return;
    }

    const totalCalories = calculateBMR(age, height, weight, gender, activity); // Ваша цель калорий

    // 1. Считаем белки (приоритет №1) - по вашей формуле от веса
    const proteinGrams = prot(activity, weight);
    const proteinKcal = proteinGrams * 4; // В 1г белка 4 ккал

    // 2. Считаем жиры (приоритет №2) - берем 30% от калорийности
    const fatKcal = totalCalories * 0.3;
    const fatGrams = fatKcal / 9; // В 1г жира 9 ккал

    // 3. Считаем углеводы (приоритет №3) - всё оставшееся место
    // Отнимаем от общих калорий калории белков и жиров
    const carbKcal = totalCalories - proteinKcal - fatKcal;
    const carbGrams = carbKcal / 4; // В 1г углеводов 4 ккал

    // Формируем объект (не забудьте округлять и про витамины!)
    const requestData = {
        bmr: Math.round(totalCalories),
        protein: Math.round(proteinGrams),
        fat: Math.round(fatGrams),
        carb: Math.round(Math.max(0, carbGrams)), 
        allergy: allergy || "немає",
        health: health || "немає",
        vitamins: vitam(age, gender, weight, activity) // Исправленный вызов
    };

    console.log("POST DATA:", requestData);

    const resultDiv = document.getElementById("result");
    resultDiv.innerText = "⏳ Генеруємо меню, зачекайте...";
    resultDiv.style.color = "blue";

    // Автоматичний вибір адреси (локально або сервер)
    const apiUrl =
        location.hostname === "localhost" || location.hostname === "127.0.0.1"
            ? "http://localhost:3000"
            : "https://back-end-daij.onrender.com";

    try {
        const response = await fetch(apiUrl, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData) 
        });
        // Найдите место, где вы вставляете ответ (fetch('/api/diet')...)
const result = await response.json();
const dietElement = document.getElementById('diet-output'); // ID вашего окна диеты

try {
    const dietData = JSON.parse(result.message); // Парсим строку в объект
    
    // Генерируем чистый HTML вместо сырого текста
    dietElement.innerHTML = `
        <div class="diet-result">
            <p><strong>🍳 Завтрак:</strong> ${dietData.завтрак}</p>
            <p><strong>🍲 Обед:</strong> ${dietData.обед}</p>
            <p><strong>🥗 Ужин:</strong> ${dietData.ужин}</p>
            <hr>
            <p><strong>💡 Советы:</strong> ${dietData.советы}</p>
        </div>
    `;
} catch (e) {
    // Если ИИ все же прислал не JSON, просто выводим текст
    dietElement.innerText = result.message;
}

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // const data = await response.json();
        
        const dietTab = document.getElementById('output'); // Убедитесь, что ID элемента верный (например, 'output' или 'diet-content')
        if (dietTab) {
            // ВАЖНО: используем innerHTML, а не innerText, чтобы работали теги
            dietTab.innerHTML = formatDietToHtml(data.message); // data.message - это ответ от вашего сервера
        }
        if (data.diet) {
            resultDiv.style.color = "black";
            resultDiv.innerText = data.diet; 
            console.log(data.diet); 
        } else {
            resultDiv.innerText = "Сталася помилка при генерації.";
            resultDiv.style.color = "red";
            console.error("Помилка:", data.error);
        }

    } catch (error) {
        resultDiv.innerText = "Не вдалося з'єднатися з сервером.";
        resultDiv.style.color = "red";
        console.error("Помилка fetch:", error);
    }
}