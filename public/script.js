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
// РОЗРАХУНОК BMR (БЕЗ ЗМІН)
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

    return base * (multipliers[activity] || 1.2); 
}

// Функція для розрахунку вітамінів (БЕЗ ЗМІН)
function vitam(age,gender,weight,activity){
    age=Number(age);
    weight=Number(weight);
    // Проста заглушка/логіка для вітамінів, як було раніше
    return { Vitamin_C:90, Vitamin_D:800, Vitamin_A:700 }; 
}

// Глобальна змінна для зберігання даних дієти (щоб перемикати дні без перезавантаження)
let globalDietData = null;

// ===============================
// ОБРОБКА ФОРМИ ТА ЗАПИТ ДО СЕРВЕРА
// ===============================
document.getElementById('dietForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Збір даних з форми
    const formData = new FormData(event.target);
    const age = formData.get('age');
    const height = formData.get('height');
    const weight = formData.get('weight');
    const gender = formData.get('gender');
    const activity = formData.get('activity');
    const allergy = formData.get('allergy');
    const health = formData.get('health');

    // Розрахунки
    const bmr = calculateBMR(age, height, weight, gender, activity);
    const protein = Math.round((bmr * 0.3) / 4);
    const fat = Math.round((bmr * 0.3) / 9);
    const carb = Math.round((bmr * 0.4) / 4);

    const requestData = {
        age, height, weight, gender, activity, allergy, health,
        bmr: Math.round(bmr),
        protein, fat, carb,
        vitamins: vitam(age, gender, weight, activity)
    };

    console.log("Відправляємо дані:", requestData);

    // Оновлення інтерфейсу (показати лоадер, сховати старе)
    const emptyState = document.getElementById("empty-state");
    const dietContent = document.getElementById("diet-content");
    const loader = document.getElementById("loader");

    if(emptyState) emptyState.style.display = 'none';
    if(dietContent) dietContent.style.display = 'none';
    if(loader) loader.style.display = 'flex';

    // Вибір API URL
    const apiUrl =
        location.hostname === "localhost" || location.hostname === "127.0.0.1"
            ? "http://localhost:3000"
            : "https://back-end-daij.onrender.com";

    try {
        const response = await fetch(apiUrl, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData) 
        });

        if (!response.ok) throw new Error(`Помилка HTTP: ${response.status}`);

        const data = await response.json();
        
        // Ховаємо лоадер
        if(loader) loader.style.display = 'none';
        if(dietContent) dietContent.style.display = 'block';

        // Обробка отриманих даних
        let dietData = data.diet; // Очікуємо, що сервер повертає { diet: "..." } або об'єкт
        
        // Якщо це рядок (JSON у вигляді тексту), парсимо його
        if (typeof dietData === 'string') {
            try {
                // Видаляємо можливі markdown-теги ```json ... ```
                dietData = dietData.replace(/```json/g, '').replace(/```/g, '').trim();
                dietData = JSON.parse(dietData);
            } catch (e) {
                console.error("Помилка парсингу JSON:", e);
                // Якщо не вдалося розпарсити, виводимо як простий текст (markdown)
                const contentDiv = document.getElementById('day-content');
                if(contentDiv) contentDiv.innerHTML = marked.parse(data.diet);
                return;
            }
        }

        // Якщо маємо правильну структуру даних — малюємо красивий інтерфейс
        if (dietData && (dietData.meal_plan || dietData.mealPlan)) {
            renderDietPlan(dietData);
        } else {
            console.error("Некоректна структура даних:", dietData);
            const contentDiv = document.getElementById('day-content');
            if(contentDiv) contentDiv.innerHTML = `<p class="text-red-500">Отримано некоректні дані від сервера. Спробуйте ще раз.</p>`;
        }

    } catch (err) {
        console.error("Помилка запиту:", err);
        if(loader) loader.style.display = 'none';
        if(emptyState) {
            emptyState.style.display = 'block';
            emptyState.innerHTML = `<p class="text-red-500 font-bold">Виникла помилка: ${err.message}</p>`;
        }
    }
});

// ===============================
// ЛОГІКА ВІДОБРАЖЕННЯ (RENDER)
// ===============================

// Функція для малювання всього плану
function renderDietPlan(data) {
    globalDietData = data; // Зберігаємо дані глобально
    const mealPlan = data.meal_plan || data.mealPlan;
    const assumptions = data.general_assumptions || data.generalAssumptions;
    const recommendations = data.general_recommendations || data.generalRecommendations;

    // 1. Вивід приміток (Assumptions)
    const assumptionsDiv = document.getElementById('assumptions-container');
    if (assumptionsDiv && assumptions && assumptions.length > 0) {
        let html = `<h4 class="font-bold mb-2 flex items-center gap-2 text-yellow-800 dark:text-yellow-200"><i class="fa-solid fa-circle-info"></i> Важливі зауваження:</h4><ul class="list-disc list-inside space-y-1">`;
        assumptions.forEach(item => html += `<li>${item}</li>`);
        html += `</ul>`;
        assumptionsDiv.innerHTML = html;
        assumptionsDiv.style.display = 'block';
    } else if (assumptionsDiv) {
        assumptionsDiv.style.display = 'none';
    }

    // 2. Створення кнопок навігації по днях
    const navDiv = document.getElementById('days-nav');
    if (navDiv && mealPlan) {
        navDiv.innerHTML = ''; // Очистка
        mealPlan.forEach((day, index) => {
            const btn = document.createElement('button');
            // Стилізація кнопок (Tailwind)
            btn.className = `day-btn px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300 transition focus:outline-none ${index === 0 ? 'active ring-2 ring-green-500 bg-green-500 text-white border-green-500' : 'bg-white dark:bg-gray-800'}`;
            btn.textContent = day.day; // Назва дня (наприклад, "День 1")
            
            // Подія кліку
            btn.onclick = () => switchDay(index, btn);
            navDiv.appendChild(btn);
        });
    }

    // 3. Відображення першого дня за замовчуванням
    renderDay(0);

    // 4. Вивід загальних рекомендацій
    const recDiv = document.getElementById('recommendations-container');
    if (recDiv && recommendations) {
        const waterText = recommendations.water_intake || recommendations.waterIntake || "Пийте достатньо води.";
        const foodSubs = recommendations.food_substitutions || recommendations.foodSubstitutions || "Можна замінювати продукти на аналогічні.";
        
        // Форматування жирного тексту з Markdown (**text**) в HTML (<b>text</b>)
        const formatText = (t) => t ? t.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-700 dark:text-blue-300">$1</strong>').replace(/\n/g, '<br>') : '';
        
        recDiv.innerHTML = `
            <h3 class="text-lg font-bold mb-4 text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <i class="fa-solid fa-lightbulb"></i> Поради нутриціолога
            </h3>
            <div class="space-y-4 text-sm">
                <div>
                    <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-1">💧 Питний режим:</h4>
                    <p class="text-gray-600 dark:text-gray-400 leading-relaxed">${formatText(waterText)}</p>
                </div>
                <div class="border-t border-blue-200 dark:border-blue-800 pt-4">
                    <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-1">🔄 Заміни продуктів:</h4>
                    <p class="text-gray-600 dark:text-gray-400 leading-relaxed">${formatText(foodSubs)}</p>
                </div>
            </div>
        `;
        recDiv.style.display = 'block';
    } else if (recDiv) {
        recDiv.style.display = 'none';
    }
}

// Функція для відображення конкретного дня
function renderDay(dayIndex) {
    const contentDiv = document.getElementById('day-content');
    if (!globalDietData || !contentDiv) return;
    
    const mealPlan = globalDietData.meal_plan || globalDietData.mealPlan;
    const dayData = mealPlan[dayIndex];
    
    if (!dayData) return;

    let html = '';

    // Блок підсумків дня (Калорії та БЖВ)
    const summary = dayData.daily_summary || dayData.dailySummary || {};
    html += `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center shadow-sm">
            <div><div class="text-xs text-gray-500 uppercase tracking-wide">Калорії</div><div class="text-lg font-bold text-green-600">${summary.calories_kcal || 0}</div></div>
            <div><div class="text-xs text-gray-500 uppercase tracking-wide">Білки</div><div class="text-lg font-bold text-blue-500">${summary.proteins_g || 0}г</div></div>
            <div><div class="text-xs text-gray-500 uppercase tracking-wide">Жири</div><div class="text-lg font-bold text-yellow-500">${summary.fats_g || 0}г</div></div>
            <div><div class="text-xs text-gray-500 uppercase tracking-wide">Вуглеводи</div><div class="text-lg font-bold text-orange-500">${summary.carbohydrates_g || 0}г</div></div>
        </div>
    `;

    // Генерація карток для кожного прийому їжі
    if (dayData.meals && dayData.meals.length > 0) {
        dayData.meals.forEach(meal => {
            // Список інгредієнтів
            const ingredientsHtml = meal.ingredients.map(ing => 
                `<li class="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span class="text-gray-700 dark:text-gray-300 flex items-center gap-2"><i class="fa-solid fa-check text-green-400 text-xs"></i> ${ing.item}</span>
                    <span class="font-medium text-gray-900 dark:text-white whitespace-nowrap ml-2">${ing.weight_g || ing.weight_ml || ''} ${ing.weight_ml ? 'мл' : 'г'}</span>
                 </li>`
            ).join('');

            // Дані по нутрієнтах страви
            const nut = meal.nutrition;

            html += `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <!-- Заголовок картки -->
                <div class="bg-gray-50 dark:bg-gray-750 px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <span class="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <i class="fa-regular fa-clock"></i> ${meal.name}
                    </span>
                    <span class="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-xs px-2.5 py-1 rounded-full font-bold">
                        🔥 ${nut.calories_kcal} ккал
                    </span>
                </div>
                
                <div class="p-5">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">${meal.dish}</h3>
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        <!-- Інгредієнти -->
                        <div>
                            <h4 class="text-xs font-bold text-gray-400 uppercase mb-3">Інгредієнти</h4>
                            <ul class="mb-4">${ingredientsHtml}</ul>
                        </div>
                        
                        <!-- Макронутрієнти та Вітаміни -->
                        <div>
                            <h4 class="text-xs font-bold text-gray-400 uppercase mb-3">На порцію</h4>
                            <div class="grid grid-cols-3 gap-2 mb-4 text-center">
                                <div class="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                                    <div class="text-[10px] text-blue-600 dark:text-blue-300 uppercase">Білків</div>
                                    <div class="font-bold text-blue-800 dark:text-blue-100">${nut.proteins_g}г</div>
                                </div>
                                <div class="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
                                    <div class="text-[10px] text-yellow-600 dark:text-yellow-300 uppercase">Жирів</div>
                                    <div class="font-bold text-yellow-800 dark:text-yellow-100">${nut.fats_g}г</div>
                                </div>
                                <div class="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg">
                                    <div class="text-[10px] text-orange-600 dark:text-orange-300 uppercase">Вугл.</div>
                                    <div class="font-bold text-orange-800 dark:text-orange-100">${nut.carbohydrates_g}г</div>
                                </div>
                            </div>
                            ${(meal.vitamins_minerals || meal.vitaminsMinerals) ? `
                            <div class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg leading-relaxed">
                                <i class="fa-solid fa-capsules text-green-500 mr-1"></i> ${meal.vitamins_minerals || meal.vitaminsMinerals}
                            </div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
    }

    contentDiv.innerHTML = html;
}

// Функція перемикання вкладок
function switchDay(index, btnElement) {
    // Знімаємо активний клас з усіх кнопок
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.classList.remove('active', 'ring-2', 'ring-green-500', 'bg-green-500', 'text-white', 'border-green-500');
        btn.classList.add('bg-white', 'dark:bg-gray-800'); // Повертаємо дефолтний фон
    });
    
    // Додаємо активний клас на натиснуту кнопку
    btnElement.classList.remove('bg-white', 'dark:bg-gray-800');
    btnElement.classList.add('active', 'ring-2', 'ring-green-500', 'bg-green-500', 'text-white', 'border-green-500');
    
    renderDay(index);
}


// ===============================
// ІНШІ ФУНКЦІЇ ІНТЕРФЕЙСУ (БЕЗ ЗМІН)
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    // Перемикач теми
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
        });
    }

    // Логіка редагування Hero Banner (як було)
    const selectedElement = document.querySelector('.editable-element');
    
    function updateCSSVar(element, varName, value) {
        if(element) element.style.setProperty(varName, value);
    }

    const inputs = ['hero-title-input', 'hero-subtitle-input'];
    inputs.forEach(id => {
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

    // Disclaimer Overlay
    window.closeDisclaimer = function() {
        const overlay = document.getElementById('disclaimer-overlay');
        if(overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
        }
    };
});