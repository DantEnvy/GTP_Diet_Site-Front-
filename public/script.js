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


// ... (ваші функції calculateBMR та vitam залишаються без змін) ...
function calculateBMR(age, height, weight, gender, activity) {
    age = Number(age);
    height = Number(height);
    weight = Number(weight);
    const multipliers = { very_high: 1.9, high: 1.725, medium: 1.55, small: 1.375, low: 1.2 };
    const base = (10 * weight) + (6.25 * height) - (5 * age) + (gender === "male" ? 5 : -161);
    return Math.round(base * (multipliers[activity] || 1.2)); 
}
function vitam(age, gender, weight, activity){ return {}; } // (ваша функція)

document.getElementById("diet-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    // 1. Збір даних (як у вас було)
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const activity = document.getElementById("activity").value;
    const allergy = document.getElementById("allergy").value || "немає";
    const health = document.getElementById("health").value || "здоровий";
    
    const bmr = calculateBMR(age, height, weight, gender, activity);
    let protein = Math.round(weight * 2);
    let fat = Math.round(weight * 1);
    let carb = Math.round((bmr - (protein * 4) - (fat * 9)) / 4);
    
    const requestData = {
        age, height, weight, gender, bmr, protein, fat, carb, allergy, health,
        vitamins: vitam(age, gender, weight, activity)
    };

    const resultDiv = document.getElementById("result");
    
    // Поки вантажиться, залишаємо красиву рамку, але змінюємо текст
    resultDiv.innerHTML = '<div class="text-xl text-blue-500 font-bold animate-pulse">⏳ Генеруємо меню...</div>';
    
    const apiUrl = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://back-end-daij.onrender.com";

    try {
        const response = await fetch(apiUrl, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData) 
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error);

        if (data.diet) {
            // === КЛЮЧОВИЙ МОМЕНТ ===
            // Ми прибираємо класи заглушки (h-64, center, border-dashed), 
            // щоб контент міг розтягнути блок.
            resultDiv.className = "w-full mt-8"; // Даємо ширину і відступ
            
            renderDietPlan(data.diet);
        }

    } catch (error) {
        resultDiv.innerHTML = `<div class="text-red-500 font-bold p-4">❌ Помилка: ${error.message}</div>`;
    }
});

function renderDietPlan(jsonString) {
    const resultDiv = document.getElementById("result");
    
    try {
        const dietData = JSON.parse(jsonString);
        let html = '';

        // Рекомендації
        if (dietData.recommendations) {
            html += `<div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded shadow-sm">
                        <h3 class="text-lg font-bold text-blue-800">💡 Рекомендації</h3>
                        <p class="text-blue-700">${dietData.recommendations}</p>
                     </div>`;
        }

        // Дні та їжа
        if (dietData.days) {
            dietData.days.forEach(day => {
                html += `
                <div class="day-card bg-white rounded-xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
                    <div class="day-header bg-gray-800 text-white p-4 flex justify-between items-center flex-wrap gap-2">
                        <h2 class="text-xl font-bold">📅 ${day.day_number}</h2>
                        <div class="text-sm bg-gray-700 px-3 py-1 rounded-full">
                            🔥 ${day.total_calories} ккал 
                            <span class="text-gray-400 mx-1">|</span> 
                            Б: ${day.macros.protein} Ж: ${day.macros.fat} В: ${day.macros.carbs}
                        </div>
                    </div>
                    
                    <div class="divide-y divide-gray-100">
                        ${day.meals.map(meal => `
                            <div class="p-4 hover:bg-gray-50 transition-colors flex justify-between items-start gap-4">
                                <div>
                                    <span class="text-xs font-bold uppercase text-gray-400 tracking-wider">${meal.type}</span>
                                    <h4 class="text-lg font-semibold text-gray-800 mt-1">${meal.name}</h4>
                                    <p class="text-sm text-gray-600 mt-1">${meal.description}</p>
                                </div>
                                <div class="text-right whitespace-nowrap">
                                    <div class="text-green-600 font-bold">${meal.calories} ккал</div>
                                    <div class="text-xs text-gray-400 mt-1">Б:${meal.p} Ж:${meal.f} В:${meal.c}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            });
        }
        
        resultDiv.innerHTML = html;

    } catch (e) {
        console.error(e);
        resultDiv.innerHTML = `<div class="text-red-500">Не вдалося розібрати відповідь.</div>`;
    }
}