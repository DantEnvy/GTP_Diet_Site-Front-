// ПЕРЕИМЕНУЙТЕ ФУНКЦИЮ, чтобы не было конфликта!
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

function toggleLanguage() {
    currentLang = currentLang === 'uk' ? 'en' : 'uk';
    localStorage.setItem('lang', currentLang);
    updateLanguage();
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


async function generateDiet() {
    const age = document.getElementById("age").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || 'male';
    const language = document.getElementById("lang-text").value;
    
    // ИСПРАВЛЕНИЕ 1: Дефолтное значение активности
    const activity = document.querySelector("input[name='activity']:checked")?.value || 'medium';
    
    const allergy = document.getElementById("allergy").value;
    const health = document.getElementById("health").value;    

    if (!age || !height || !weight) {
        alert("Заповніть всі обовʼязкові поля!");
        return;
    }

    // Расчеты
    const totalCalories = calculateBMR(age, height, weight, gender, activity);
    const proteinGrams = prot(activity, weight);
    const proteinKcal = proteinGrams * 4;
    const fatKcal = totalCalories * 0.3;
    const fatGrams = fatKcal / 9;
    const carbKcal = totalCalories - proteinKcal - fatKcal;
    const carbGrams = carbKcal / 4;

    const requestData = {
        age, height, weight, gender,
        bmr: Math.round(totalCalories),
        protein: Math.round(proteinGrams),
        fat: Math.round(fatGrams),
        carb: Math.round(Math.max(0, carbGrams)), 
        allergy: allergy || "немає",
        health: health || "немає",
        vitamins: vitam(age, gender, weight, activity),
        language: language || "uk"
    };

    console.log("Отправляем данные:", requestData);

    // ИСПРАВЛЕНИЕ 2: Убедитесь, что этот элемент существует в HTML!
    // Если его нет, создайте <div id="ai-result"></div> в HTML
    let resultDiv = document.getElementById("result");
    if (!resultDiv) {
        console.warn("Элемент id='result' не найден! Создаю временный.");
        resultDiv = document.createElement("div");
        resultDiv.id = "result";
        document.body.appendChild(resultDiv); // Или добавьте в нужное место
    }

    resultDiv.innerText = "⏳ Генеруємо меню, зачекайте це може зайняти декілька хвилин...";
    // ЗАМІСТЬ resultDiv.style.color = "blue"; ПИШЕМО:
    resultDiv.className = "flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-3xl dark:border-gray-700 text-blue-600 dark:text-blue-400 animate-pulse";
    // Видаляємо старий стиль, якщо він залишився
    resultDiv.removeAttribute("style");
    resultDiv.style.color = "blue";

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
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Спочатку читаємо відповідь сервера

        if (!response.ok) {
            // Якщо помилка, беремо текст помилки з сервера, а не просто статус
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        if (data.diet) {
            resultDiv.style.color = "black";
            // Используем форматирование переносов строк, если нужно
            //resultDiv.innerText = data.diet; 
            resultDiv.innerHTML = marked.parse(data.diet);
            console.log("Ответ получен:", data.diet); 
            if (data.diet) {
            // 1. ВИДАЛЯЄМО цей рядок, бо він блокує темну тему:
            // resultDiv.style.color = "black"; 
            
            // 2. Очищуємо попередні класи центрування
            resultDiv.classList.remove("flex", "items-center", "justify-center", "h-64", "text-red-500", "text-blue-500");
            
            // 3. Додаємо класи:
            // text-gray-800 - темний колір для світлої теми
            // dark:text-gray-100 - світлий колір для темної теми
            resultDiv.className = "prose-content bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-700 h-auto text-left transition-colors duration-300";
            
            // 4. Перетворюємо Markdown в HTML
            resultDiv.innerHTML = marked.parse(data.diet);
            
            console.log("Відповідь отримана"); 
        }
        } else {
            resultDiv.innerText = "Сталася помилка при генерації.";
            resultDiv.style.color = "red";
        }

    } catch (error) {
        resultDiv.innerText = "Помилка: " + error.message;
        resultDiv.style.color = "red";
        console.error("Помилка fetch:", error);
    }
}