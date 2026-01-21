// ПЕРЕИМЕНУЙТЕ ФУНКЦИЮ, чтобы не было конфликта!
function calculateBMR(age, height, weight, gender, activity, goal) {
    age = Number(age);
    height = Number(height);
    weight = Number(weight);
    const multipliers_goal = {
        big: 1.15,
        normal: 1,
        low: 0.85
    };

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

    return base * (multipliers[activity]) * (multipliers_goal[goal] || 1); 
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

/*
async function generateDiet() {
    const age = document.getElementById("age").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || 'male';
    const langText = document.getElementById("lang-text").innerText; // Вернет "UA" или "EN"
    const language = langText === 'UA' ? 'uk' : 'en';
    
    const activity = document.querySelector("input[name='activity']:checked")?.value || 'medium';
    const goal = document.querySelector("input[name='goal']:checked")?.value || 'normal';

    const allergy = document.getElementById("allergy").value;
    const health = document.getElementById("health").value;    

    if (!age || !height || !weight) {
        alert("Заповніть всі обовʼязкові поля!");
        return;
    }

    const totalCalories = calculateBMR(age, height, weight, gender, activity, goal);
    const proteinGrams = prot(activity, weight);
    const proteinKcal = proteinGrams * 4;
    const fatKcal = totalCalories * 0.3;
    const fatGrams = fatKcal / 9;
    const carbKcal = totalCalories - proteinKcal - fatKcal;
    const carbGrams = carbKcal / 4;
    const food = document.getElementById("food").value;

    const requestData = {
        age, height, weight, gender,
        bmr: Math.round(totalCalories),
        protein: Math.round(proteinGrams),
        fat: Math.round(fatGrams),
        carb: Math.round(Math.max(0, carbGrams)), 
        allergy: allergy || "немає",
        goal: goal || "підтримання",
        health: health || "немає",
        vitamins: vitam(age, gender, weight, activity),
        language: language || "uk",
        food: food || "немає"
    };

    console.log("Отправляем данные:", requestData);

    let resultDiv = document.getElementById("result");
    if (!resultDiv) {
        console.warn("Элемент id='result' не найден! Создаю временный.");
        resultDiv = document.createElement("div");
        resultDiv.id = "result";
        document.body.appendChild(resultDiv);
    }

    // ==========================================
    // 1. ЗАПУСК АНІМАЦІЇ ЗАВАНТАЖЕННЯ (КОТИК)
    // ==========================================
    
    // Скидаємо старі стилі та класи перед анімацією
    resultDiv.className = ""; 
    resultDiv.removeAttribute("style");
    
    // Вставляємо HTML котика
    if (language == 'uk') {
        resultDiv.innerHTML = `
            <div class="loader-container" style="margin: 0 auto; transform: scale(0.8); height: 300px;">
                <div class="scene">
                    <div class="stove"></div>
                    <div class="pan-group">
                        <div class="pan-body">
                            <div class="steam"></div>
                        </div>
                        <div class="pan-handle"></div>
                        <div class="fish"></div>
                    </div>
                    <div class="cat">
                        <div class="arm left"></div>
                        <div class="arm right"></div>
                        <div class="body"></div>
                        <div class="head">
                            <div class="face">
                                <div class="eyes">
                                    <div class="eye"></div>
                                    <div class="eye"></div>
                                </div>
                                <div class="nose"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="loading-text" style="text-align: center; margin-top: 20px;">
                    Генеруємо меню<span class="dots"></span>
                    <h6 style="text-align: center; margin-top: 12px;">Це може зайняти до 2-х хвилин</h6>
                </div>
            </div>
        `;
    } else{
        resultDiv.innerHTML = `
            <div class="loader-container" style="margin: 0 auto; transform: scale(0.8); height: 300px;">
                <div class="scene">
                    <div class="stove"></div>
                    <div class="pan-group">
                        <div class="pan-body">
                            <div class="steam"></div>
                        </div>
                        <div class="pan-handle"></div>
                        <div class="fish"></div>
                    </div>
                    <div class="cat">
                        <div class="arm left"></div>
                        <div class="arm right"></div>
                        <div class="body"></div>
                        <div class="head">
                            <div class="face">
                                <div class="eyes">
                                    <div class="eye"></div>
                                    <div class="eye"></div>
                                </div>
                                <div class="nose"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="loading-text" style="text-align: center; margin-top: 20px;">
                    Generating menu<span class="dots"></span>
                    <h6>This may take up to 2 minutes.</h6>
                </div>
            </div>
        `;
    }
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

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        // ==========================================
        // 2. ОБРОБКА УСПІШНОЇ ВІДПОВІДІ
        // ==========================================
        if (data.diet) {
            // Видаляємо котика (очищаємо div)
            resultDiv.innerHTML = "";

            // Застосовуємо стилі для тексту результату
            // Стало:
            resultDiv.className = "prose-content bg-white dark:bg-gray-800 text-gray-800 dark:text-white [&_*]:dark:text-white p-6 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-700 h-auto text-left transition-colors duration-300 shadow-lg";
            
            // Вставляємо згенерований текст (Markdown -> HTML)
            resultDiv.innerHTML = marked.parse(data.diet);
            
            console.log("Відповідь отримана"); 
        } else {
            resultDiv.innerText = "Сталася помилка при генерації (відсутнє поле diet).";
            resultDiv.style.color = "red";
        }

    } catch (error) {
        resultDiv.className = "p-5 text-center text-red-600 font-bold bg-red-100 rounded-xl border border-red-300";
        resultDiv.innerText = "Помилка: " + error.message;
        console.error("Помилка fetch:", error);
    }
}*/

async function generateDiet() {
    const age = document.getElementById("age").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || 'male';
    const langText = document.getElementById("lang-text").innerText; // Вернет "UA" или "EN"
    const language = langText === 'UA' ? 'uk' : 'en';
    
    const activity = document.querySelector("input[name='activity']:checked")?.value || 'medium';
    const goal = document.querySelector("input[name='goal']:checked")?.value || 'normal';

    const allergy = document.getElementById("allergy").value;
    const health = document.getElementById("health").value;    

    if (!age || !height || !weight) {
        alert("Заповніть всі обовʼязкові поля!");
        return;
    }

    const totalCalories = calculateBMR(age, height, weight, gender, activity, goal);
    const proteinGrams = prot(activity, weight);
    const proteinKcal = proteinGrams * 4;
    const fatKcal = totalCalories * 0.3;
    const fatGrams = fatKcal / 9;
    const carbKcal = totalCalories - proteinKcal - fatKcal;
    const carbGrams = carbKcal / 4;
    const food = document.getElementById("food").value;

    const requestData = {
        age, height, weight, gender,
        bmr: Math.round(totalCalories),
        protein: Math.round(proteinGrams),
        fat: Math.round(fatGrams),
        carb: Math.round(Math.max(0, carbGrams)), 
        allergy: allergy || "немає",
        goal: goal || "підтримання",
        health: health || "немає",
        vitamins: vitam(age, gender, weight, activity),
        language: language || "uk",
        food: food || "немає"
    };

    console.log("Отправляем данные:", requestData);

    let resultDiv = document.getElementById("result");
    if (!resultDiv) {
        console.warn("Элемент id='result' не найден! Создаю временный.");
        resultDiv = document.createElement("div");
        resultDiv.id = "result";
        document.body.appendChild(resultDiv);
    }

    // ==========================================
    // 1. ЗАПУСК АНІМАЦІЇ ЗАВАНТАЖЕННЯ (КОТИК)
    // ==========================================
    
    // Скидаємо старі стилі та класи перед анімацією
    resultDiv.className = ""; 
    resultDiv.removeAttribute("style");
    
    // Вставляємо HTML котика
    if (language == 'uk') {
        resultDiv.innerHTML = `
            <div class="loader-container" style="margin: 0 auto; transform: scale(0.8); height: 300px;">
                <div class="scene">
                    <div class="stove"></div>
                    <div class="pan-group">
                        <div class="pan-body">
                            <div class="steam"></div>
                        </div>
                        <div class="pan-handle"></div>
                        <div class="fish"></div>
                    </div>
                    <div class="cat">
                        <div class="arm left"></div>
                        <div class="arm right"></div>
                        <div class="body"></div>
                        <div class="head">
                            <div class="face">
                                <div class="eyes">
                                    <div class="eye"></div>
                                    <div class="eye"></div>
                                </div>
                                <div class="nose"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="loading-text" style="text-align: center; margin-top: 20px;">
                    Генеруємо меню<span class="dots"></span>
                    <h6 style="text-align: center; margin-top: 12px;">Це може зайняти до 2-х хвилин</h6>
                </div>
            </div>
        `;
    } else{
        resultDiv.innerHTML = `
            <div class="loader-container" style="margin: 0 auto; transform: scale(0.8); height: 300px;">
                <div class="scene">
                    <div class="stove"></div>
                    <div class="pan-group">
                        <div class="pan-body">
                            <div class="steam"></div>
                        </div>
                        <div class="pan-handle"></div>
                        <div class="fish"></div>
                    </div>
                    <div class="cat">
                        <div class="arm left"></div>
                        <div class="arm right"></div>
                        <div class="body"></div>
                        <div class="head">
                            <div class="face">
                                <div class="eyes">
                                    <div class="eye"></div>
                                    <div class="eye"></div>
                                </div>
                                <div class="nose"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="loading-text" style="text-align: center; margin-top: 20px;">
                    Generating menu<span class="dots"></span>
                    <h6>This may take up to 2 minutes.</h6>
                </div>
            </div>
        `;
    }
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

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        // ==========================================
        // 2. ОБРОБКА УСПІШНОЇ ВІДПОВІДІ
        // ==========================================
        if (data.diet) {
            // 1. Очищаємо контейнер від котика
            resultDiv.innerHTML = "";

            // 2. Встановлюємо стилі для картки результату
            resultDiv.className = "prose-content bg-white dark:bg-gray-800 text-gray-800 dark:text-white [&_*]:dark:text-white p-6 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-700 h-auto text-left transition-colors duration-300 shadow-lg";
            
            // 3. Створюємо кнопку завантаження
            const downloadBtn = document.createElement('button');
            downloadBtn.innerText = language === 'uk' ? "📄 Завантажити у PDF" : "📄 Download PDF";
            downloadBtn.className = "mb-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 no-print";
            downloadBtn.onclick = downloadPDF;

            // 4. Створюємо окремий контейнер для самого тексту дієти
            const contentWrapper = document.createElement('div');
            contentWrapper.id = "diet-content";
            contentWrapper.innerHTML = marked.parse(data.diet);

            // 5. Додаємо спочатку кнопку, а потім текст у головний контейнер
            resultDiv.appendChild(downloadBtn);
            resultDiv.appendChild(contentWrapper);

            // 6. Обробляємо картинки всередині контенту
            const images = contentWrapper.querySelectorAll('img');
            images.forEach(img => {
                img.style.width = "100%";
                img.style.maxWidth = "500px";
                img.style.height = "300px";
                img.style.objectFit = "cover";
                img.style.borderRadius = "15px";
                img.style.margin = "15px 0";
                img.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
                
                img.onerror = function() {
                    this.style.display = 'none';
                };
            });
            
            console.log("Відповідь отримана та відображена"); 
        } else {
            resultDiv.innerText = "Сталася помилка при генерації (відсутнє поле diet).";
            resultDiv.style.color = "red";
        }

    } catch (error) {
        resultDiv.className = "p-5 text-center text-red-600 font-bold bg-red-100 rounded-xl border border-red-300";
        resultDiv.innerText = "Помилка: " + error.message;
        console.error("Помилка fetch:", error);
    }
}

function downloadPDF() {
    const element = document.getElementById('result');
    
    // Перевірка, чи є що завантажувати
    if (!element || element.innerText.trim() === "" || element.querySelector('.loader-container')) {
        alert("Спочатку згенеруйте дієту!");
        return;
    }

    const opt = {
        margin: [10, 10, 10, 10],
        filename: 'diet_plan.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}