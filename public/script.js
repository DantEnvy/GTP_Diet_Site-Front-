// ===============================
// РОЗРАХУНОК BMR
// ===============================
/*function calculateBMR(age, height, weight, gender, activity) {
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

function prot(activity,weight){const m={very_high:2,high:1.8,medium:1.4,small:1.2,low:0.8}; return Number(weight)*(m[activity])}*/

// ===============================
// НАДСИЛАННЯ ДАНИХ НА БЕКЕНД
// ===============================
/*
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

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
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
} */


    // ===============================
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

    return Math.round(base * (multipliers[activity] || 1.2)); 
}

function vitam(age, gender, weight, activity){
    // Ваша логіка вітамінів (залишаємо без змін, скорочено для прикладу)
    return { C: 90, D: 800 }; 
}

// ===============================
// ВІДПРАВКА ДАНИХ
// ===============================
// ===============================
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

    return Math.round(base * (multipliers[activity] || 1.2)); 
}

function vitam(age, gender, weight, activity){
    // Ваша функция витаминов (сокращено для примера, оставьте свою версию если она больше)
    return { Vitamin_C: 90, Vitamin_D: 800 }; 
}

// ===============================
// ОБРОБКА ФОРМИ
// ===============================
document.getElementById("diet-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const activity = document.getElementById("activity").value;
    const goal = document.getElementById("goal").value;
    const allergy = document.getElementById("allergy").value;
    const health = document.getElementById("health").value;

    const bmr = calculateBMR(age, height, weight, gender, activity);
    
    // Данные для отправки
    const requestData = {
        age, height, weight, gender, activity, goal, allergy, health,
        bmr: bmr,
        vitamins: vitam(age, gender, weight, activity)
    };

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = '<div class="loader">🥗 ШІ складає ваше меню... це займе 5-10 секунд...</div>';
    
    // Адрес сервера
    const apiUrl = location.hostname === "localhost" || location.hostname === "127.0.0.1"
            ? "http://localhost:3000"
            : "https://back-end-daij.onrender.com";

    try {
        const response = await fetch(apiUrl, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData) 
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error);

        if (data.diet) {
            renderDiet(data.diet); // Вызываем функцию отрисовки
        }

    } catch (error) {
        resultDiv.innerHTML = `<div style="color:red; text-align:center; padding:20px;">❌ Помилка: ${error.message}</div>`;
        console.error(error);
    }
});

// ===============================
// ФУНКЦІЯ ОТРИСОВКИ (НОВА)
// ===============================
function renderDiet(jsonString) {
    const resultDiv = document.getElementById("result");
    
    try {
        // Очищаем строку от возможных остатков Markdown (хотя сервер теперь отдает чистый JSON)
        const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        const dietData = JSON.parse(cleanJson);
        
        let html = '';

        // 1. Блок рекомендаций
        if(dietData.recommendations) {
            html += `
            <div class="recommendation-card">
                <h3>💡 Поради дієтолога</h3>
                <p>${dietData.recommendations}</p>
            </div>`;
        }

        // 2. Блок дней и приемов пищи
        if (dietData.days && Array.isArray(dietData.days)) {
            dietData.days.forEach(day => {
                html += `
                <div class="day-card">
                    <div class="day-header">
                        <h2>📅 ${day.day_number}</h2>
                        <div class="day-stats">
                            <span>🔥 ${day.total_calories} ккал</span>
                            <span class="macro-p">Білки: ${day.macros.protein}г</span>
                            <span class="macro-f">Жири: ${day.macros.fat}г</span>
                            <span class="macro-c">Вугл: ${day.macros.carbs}г</span>
                        </div>
                    </div>
                    
                    <div class="meals-container">
                        ${day.meals.map(meal => `
                            <div class="meal-row">
                                <div class="meal-info">
                                    <span class="meal-type">${meal.type}</span>
                                    <div class="meal-name">${meal.name}</div>
                                    <div class="meal-desc">${meal.description}</div>
                                </div>
                                <div class="meal-macros">
                                    <div class="cal-badge">${meal.calories} ккал</div>
                                    <div class="micro-stats">Б:${meal.protein} Ж:${meal.fat} В:${meal.carbs}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            });
        }

        resultDiv.innerHTML = html;

    } catch (e) {
        console.error("JSON Parse Error:", e);
        resultDiv.innerHTML = `<div class="error-box">Не вдалося відобразити меню. Спробуйте ще раз.<br><small>${e.message}</small></div>`;
    }
}