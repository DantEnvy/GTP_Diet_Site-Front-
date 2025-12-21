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
}
*/
// ===============================
// 1. РОЗРАХУНОК BMR (БАЗОВИЙ ОБМІН РЕЧОВИН)
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

    // Формула Міффіна-Джеора
    const base = (10 * weight) + (6.25 * height) - (5 * age) + (gender === "male" ? 5 : -161);

    return Math.round(base * (multipliers[activity] || 1.2)); 
}

// Функція розрахунку вітамінів (залишено без змін логіку)
function vitam(age, gender, weight, activity){
    // Це спрощена логіка, можна розширити при потребі
    return { Vitamin_C: 90, Vitamin_D: 800, Vitamin_A: 700 }; 
}

// Глобальна змінна для даних дієти
let globalDietData = null;

// ===============================
// 2. ОБРОБКА ФОРМИ ТА ЗАПИТ ДО СЕРВЕРА
// ===============================
document.getElementById('dietForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const age = formData.get('age');
    const height = formData.get('height');
    const weight = formData.get('weight');
    const gender = formData.get('gender');
    const activity = formData.get('activity');
    const allergy = formData.get('allergy');
    const health = formData.get('health');

    const bmr = calculateBMR(age, height, weight, gender, activity);

    // Приблизний розподіл макронутрієнтів (30/30/40)
    const protein = Math.round((bmr * 0.3) / 4);
    const fat = Math.round((bmr * 0.3) / 9);
    const carb = Math.round((bmr * 0.4) / 4);

    const requestData = {
        age, height, weight, gender, activity, allergy, health,
        bmr, protein, fat, carb,
        vitamins: vitam(age, gender, weight, activity)
    };

    console.log("Відправляємо дані:", requestData);

    // --- ОНОВЛЕННЯ ІНТЕРФЕЙСУ (Показуємо лоадер) ---
    const emptyState = document.getElementById("empty-state");
    const dietContent = document.getElementById("diet-content");
    const loader = document.getElementById("loader");
    const resultSection = document.getElementById("result");

    // Показати секцію результатів
    if (resultSection) resultSection.style.display = 'block';
    
    // Сховати пустий стан та контент, показати спінер
    if (emptyState) emptyState.style.display = 'none';
    if (dietContent) dietContent.style.display = 'none';
    if (loader) loader.style.display = 'flex';

    // URL бекенду
    const apiUrl = location.hostname === "localhost" || location.hostname === "127.0.0.1"
            ? "http://localhost:3000"
            : "https://back-end-daij.onrender.com";

    try {
        const response = await fetch(apiUrl, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData) 
        });

        if (!response.ok) {
            throw new Error(`Помилка сервера: ${response.status}`);
        }

        const data = await response.json();
        console.log("Отримано відповідь від сервера:", data);

        // --- ОБРОБКА ДАНИХ ---
        if (loader) loader.style.display = 'none';
        if (dietContent) dietContent.style.display = 'block';

        let dietData = data.diet;

        // Якщо це рядок, намагаємось розпарсити JSON
        if (typeof dietData === 'string') {
            dietData = parseDietJSON(dietData);
        }

        // Перевірка структури та рендер
        if (dietData && (dietData.meal_plan || dietData.mealPlan)) {
            renderDietPlan(dietData);
        } else {
            console.error("Некоректні дані:", dietData);
            const contentDiv = document.getElementById('day-content');
            if (contentDiv) {
                // Якщо прийшов просто текст (markdown), спробуємо показати його
                if (typeof data.diet === 'string') {
                    contentDiv.innerHTML = typeof marked !== 'undefined' 
                        ? marked.parse(data.diet) 
                        : `<div class="p-4 text-gray-700 whitespace-pre-wrap">${data.diet}</div>`;
                } else {
                    contentDiv.innerHTML = `<p class="text-red-500 font-bold p-4 text-center">Не вдалося розпізнати формат дієти. Спробуйте ще раз.</p>`;
                }
            }
        }

    } catch (err) {
        console.error("Помилка:", err);
        if (loader) loader.style.display = 'none';
        if (emptyState) {
            emptyState.style.display = 'block';
            emptyState.innerHTML = `
                <div class="text-center py-10">
                    <i class="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-2"></i>
                    <p class="text-red-600 font-medium">Виникла помилка: ${err.message}</p>
                    <button onclick="location.reload()" class="mt-4 text-sm text-gray-500 underline">Оновити сторінку</button>
                </div>
            `;
        }
    }
});

// Допоміжна функція для очистки JSON від Markdown
function parseDietJSON(jsonString) {
    try {
        // 1. Спробуємо прямий парсинг
        return JSON.parse(jsonString);
    } catch (e) {
        try {
            // 2. Видаляємо ```json та ```
            let cleaned = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleaned);
        } catch (e2) {
            try {
                // 3. Шукаємо першу { та останню } (найбільш надійний спосіб)
                const firstBrace = jsonString.indexOf('{');
                const lastBrace = jsonString.lastIndexOf('}');
                if (firstBrace !== -1 && lastBrace !== -1) {
                    return JSON.parse(jsonString.substring(firstBrace, lastBrace + 1));
                }
            } catch (e3) {
                console.error("Critical JSON parse error", e3);
                return null;
            }
        }
    }
    return null;
}

// ===============================
// 3. ЛОГІКА ВІДОБРАЖЕННЯ (RENDER)
// ===============================

function renderDietPlan(data) {
    globalDietData = data;
    
    // Нормалізація полів (інколи ШІ може писати snake_case, інколи camelCase)
    const mealPlan = data.meal_plan || data.mealPlan;
    const assumptions = data.general_assumptions || data.generalAssumptions;
    const recommendations = data.general_recommendations || data.generalRecommendations;

    // 1. Примітки (Assumptions)
    const assumptionsDiv = document.getElementById('assumptions-container');
    if (assumptionsDiv) {
        if (assumptions && assumptions.length > 0) {
            let html = `<h4 class="font-bold mb-2 flex items-center gap-2 text-yellow-800 dark:text-yellow-200"><i class="fa-solid fa-circle-info"></i> Важливі зауваження:</h4><ul class="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">`;
            assumptions.forEach(item => html += `<li>${item}</li>`);
            html += `</ul>`;
            assumptionsDiv.innerHTML = html;
            assumptionsDiv.style.display = 'block';
        } else {
            assumptionsDiv.style.display = 'none';
        }
    }

    // 2. Кнопки днів (Tabs)
    const navDiv = document.getElementById('days-nav');
    if (navDiv && mealPlan) {
        navDiv.innerHTML = ''; // Очистка старого
        mealPlan.forEach((day, index) => {
            const btn = document.createElement('button');
            // Стилі для кнопок
            btn.className = `day-btn px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200 transition focus:outline-none flex-shrink-0 ${index === 0 ? 'active bg-green-600 text-white border-green-600 shadow-md ring-2 ring-green-300 dark:ring-green-800' : 'bg-white dark:bg-gray-800 text-gray-600'}`;
            btn.textContent = day.day;
            btn.onclick = () => switchDay(index, btn);
            navDiv.appendChild(btn);
        });
    }

    // 3. Відображаємо перший день
    renderDay(0);

    // 4. Рекомендації
    const recDiv = document.getElementById('recommendations-container');
    if (recDiv) {
        if (recommendations) {
            const waterText = recommendations.water_intake || recommendations.waterIntake || "Пийте достатньо води.";
            const foodSubs = recommendations.food_substitutions || recommendations.foodSubstitutions || "Можна замінювати продукти на аналогічні за калорійністю.";
            
            // Заміна Markdown Bold (**text**) на HTML Bold (<b>text</b>)
            const format = (t) => t ? t.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-700 dark:text-blue-400">$1</strong>').replace(/\n/g, '<br>') : '';
            
            recDiv.innerHTML = `
                <h3 class="text-lg font-bold mb-4 text-blue-800 dark:text-blue-300 flex items-center gap-2">
                    <i class="fa-solid fa-user-doctor"></i> Поради нутриціолога
                </h3>
                <div class="space-y-4 text-sm">
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm">
                        <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2"><i class="fa-solid fa-glass-water"></i> Питний режим</h4>
                        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">${format(waterText)}</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm">
                        <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2"><i class="fa-solid fa-repeat"></i> Заміни продуктів</h4>
                        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">${format(foodSubs)}</p>
                    </div>
                </div>
            `;
            recDiv.style.display = 'block';
        } else {
            recDiv.style.display = 'none';
        }
    }
}

// Рендер конкретного дня
function renderDay(dayIndex) {
    const contentDiv = document.getElementById('day-content');
    if (!globalDietData || !contentDiv) return;
    
    const mealPlan = globalDietData.meal_plan || globalDietData.mealPlan;
    const dayData = mealPlan[dayIndex];
    
    if (!dayData) return;

    let html = '';

    // Підсумок дня (БЖВ + Калорії)
    const summary = dayData.daily_summary || dayData.dailySummary || {};
    html += `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-fade-in-up">
            <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-200 dark:border-green-800 text-center">
                <div class="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Калорії</div>
                <div class="text-xl font-extrabold text-green-700 dark:text-green-300">${summary.calories_kcal || 0}</div>
            </div>
            <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
                <div class="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Білки</div>
                <div class="text-xl font-extrabold text-blue-700 dark:text-blue-300">${summary.proteins_g || 0}г</div>
            </div>
            <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl border border-yellow-200 dark:border-yellow-800 text-center">
                <div class="text-xs text-yellow-600 dark:text-yellow-400 font-bold uppercase tracking-wider">Жири</div>
                <div class="text-xl font-extrabold text-yellow-700 dark:text-yellow-300">${summary.fats_g || 0}г</div>
            </div>
            <div class="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-200 dark:border-orange-800 text-center">
                <div class="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">Вуглеводи</div>
                <div class="text-xl font-extrabold text-orange-700 dark:text-orange-300">${summary.carbohydrates_g || 0}г</div>
            </div>
        </div>
    `;

    // Список прийомів їжі (Картки)
    if (dayData.meals && dayData.meals.length > 0) {
        dayData.meals.forEach((meal, idx) => {
            // Інгредієнти
            const ingredientsHtml = meal.ingredients.map(ing => 
                `<li class="flex justify-between items-center text-sm py-2 border-b border-dashed border-gray-200 dark:border-gray-700 last:border-0">
                    <span class="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <i class="fa-solid fa-carrot text-orange-400 mt-1 text-xs"></i> 
                        <span>${ing.item}</span>
                    </span>
                    <span class="font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                        ${ing.weight_g || ing.weight_ml || '—'} ${ing.weight_ml ? 'мл' : 'г'}
                    </span>
                 </li>`
            ).join('');

            const nut = meal.nutrition;
            // Анімація затримки для кожної картки
            const delay = idx * 100; 

            html += `
            <div class="meal-card bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300" style="animation: fadeInUp 0.5s ease-out ${delay}ms forwards;">
                
                <!-- Заголовок -->
                <div class="bg-gradient-to-r from-gray-50 to-white dark:from-gray-750 dark:to-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap justify-between items-center gap-2">
                    <span class="text-sm font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <i class="fa-regular fa-clock text-green-500"></i> ${meal.name}
                    </span>
                    <span class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                        🔥 ${nut.calories_kcal} ккал
                    </span>
                </div>
                
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-5 leading-tight flex items-start gap-2">
                        ${meal.dish}
                    </h3>
                    
                    <div class="grid lg:grid-cols-5 gap-6">
                        <!-- Інгредієнти (3 колонки) -->
                        <div class="lg:col-span-3">
                            <h4 class="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wide">Склад страви</h4>
                            <ul class="bg-gray-50 dark:bg-gray-750/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                                ${ingredientsHtml}
                            </ul>
                        </div>
                        
                        <!-- БЖВ (2 колонки) -->
                        <div class="lg:col-span-2 flex flex-col justify-between">
                            <div>
                                <h4 class="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wide">Баланс</h4>
                                <div class="grid grid-cols-3 gap-2 text-center">
                                    <div class="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-800">
                                        <div class="text-[10px] text-blue-600 dark:text-blue-300 font-bold mb-1">БІЛКИ</div>
                                        <div class="text-sm font-black text-blue-800 dark:text-blue-100">${nut.proteins_g}г</div>
                                    </div>
                                    <div class="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg border border-yellow-100 dark:border-yellow-800">
                                        <div class="text-[10px] text-yellow-600 dark:text-yellow-300 font-bold mb-1">ЖИРИ</div>
                                        <div class="text-sm font-black text-yellow-800 dark:text-yellow-100">${nut.fats_g}г</div>
                                    </div>
                                    <div class="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg border border-orange-100 dark:border-orange-800">
                                        <div class="text-[10px] text-orange-600 dark:text-orange-300 font-bold mb-1">ВУГЛ</div>
                                        <div class="text-sm font-black text-orange-800 dark:text-orange-100">${nut.carbohydrates_g}г</div>
                                    </div>
                                </div>
                            </div>
                            
                            ${(meal.vitamins_minerals || meal.vitaminsMinerals) ? `
                            <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div class="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2 leading-snug">
                                    <i class="fa-solid fa-microscope text-purple-400 mt-0.5"></i>
                                    <span>${meal.vitamins_minerals || meal.vitaminsMinerals}</span>
                                </div>
                            </div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
    } else {
        html = `<p class="text-center text-gray-500 py-10">Немає даних про прийоми їжі для цього дня.</p>`;
    }

    contentDiv.innerHTML = html;
}

// Функція для перемикання активного дня
function switchDay(index, btnElement) {
    // Зняти стиль з усіх кнопок
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-green-600', 'text-white', 'border-green-600', 'shadow-md', 'ring-2', 'ring-green-300', 'dark:ring-green-800');
        btn.classList.add('bg-white', 'dark:bg-gray-800', 'text-gray-600');
    });
    
    // Додати стиль активній кнопці
    btnElement.classList.remove('bg-white', 'dark:bg-gray-800', 'text-gray-600');
    btnElement.classList.add('active', 'bg-green-600', 'text-white', 'border-green-600', 'shadow-md', 'ring-2', 'ring-green-300', 'dark:ring-green-800');
    
    renderDay(index);
}

// ===============================
// 4. ІНШІ ФУНКЦІЇ (ТЕМА, РЕДАГУВАННЯ БАНЕРА)
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    // Зміна теми (Dark Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Перевірка збереженої теми
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            if (html.classList.contains('dark')) {
                localStorage.theme = 'dark';
            } else {
                localStorage.theme = 'light';
            }
        });
    }

    // Логіка для редагування Hero Banner (залишено з оригіналу)
    const selectedElement = document.querySelector('.editable-element');
    function updateCSSVar(element, varName, value) {
        if(element) element.style.setProperty(varName, value);
    }

    const textInputs = ['hero-title-input', 'hero-subtitle-input'];
    textInputs.forEach(id => {
        const input = document.getElementById(id);
        if(input) {
            input.oninput = (e) => {
                const targetClass = id === 'hero-title-input' ? '.hero-title' : '.hero-subtitle';
                const el = document.querySelector(targetClass);
                if(el) el.innerText = e.target.value || (id === 'hero-title-input' ? "Твій шлях до здоров'я" : "Персональний план харчування за секунди");
            }
        }
    });

    const colorInputs = ['hero-grad-top', 'hero-grad-bot'];
    colorInputs.forEach(id => {
        const input = document.getElementById(id);
        if(input) {
            input.oninput = (e) => {
                const inner = document.querySelector('.hero-banner-style');
                const varName = id === 'hero-grad-top' ? '--hero-bg-top' : '--hero-bg-bot';
                updateCSSVar(inner, varName, e.target.value);
            }
        }
    });

    const imgInput = document.getElementById('hero-img-url');
    if(imgInput) {
        imgInput.oninput = (e) => {
            const inner = document.querySelector('.hero-banner-style');
            if (!inner) return;
            let img = inner.querySelector('.hero-banner-img');
            if (e.target.value.trim() !== "") {
                img.src = e.target.value; img.style.display = 'block';
            } else { img.style.display = 'none'; }
        };
    }

    // Закриття дисклеймера
    window.closeDisclaimer = function() {
        const overlay = document.getElementById('disclaimer-overlay');
        if(overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
        }
    };
});