// ===============================
// РОЗРАХУНОК BMR
// ===============================
// --- TRANSLATION LOGIC START ---


let currentLang = localStorage.getItem('lang') || 'uk';

function toggleLanguage() {
    currentLang = currentLang === 'uk' ? 'en' : 'uk';
    localStorage.setItem('lang', currentLang);
    updateLanguage();
}

function updateLanguage() {
    // Update button text SAFELY targeting the span inside
    const langText = document.getElementById('lang-text');
    if(langText) {
        langText.innerText = currentLang === 'uk' ? 'UA' : 'EN';
    } else {
            // Fallback if structure changes
            const btn = document.getElementById('lang-toggle');
            if (btn) btn.innerText = currentLang === 'uk' ? 'UA' : 'EN';
    }
    
    // Update all elements with data-lang-key
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.getAttribute('data-lang-key');
        
        // Проверяем, существует ли перевод для этого ключа
        if (translations[currentLang] && translations[currentLang][key]) {
            
            // --- НОВАЯ ЛОГИКА ---
            // Если это поле ввода, меняем подсказку (placeholder)
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[currentLang][key];
            } 
            // Иначе меняем текст внутри тега
            else {
                el.innerText = translations[currentLang][key];
            }
            // ---------------------
        }
    });

    // Re-render calculator results if they are visible (to update dynamic text)
    const resultArea = document.getElementById('resultArea');
    if(resultArea && !resultArea.classList.contains('hidden')) {
        calculateAndDisplay();
    }
}

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
    const gender = document.querySelector('input[name="gender"]:checked')?.value || 'male';
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
    // ... (ваш код вычислений)
    const requestData = {
        age: age,          // <--- ДОБАВИТЬ ЭТО
        height: height,    // <--- ДОБАВИТЬ ЭТО
        weight: weight,    // <--- ДОБАВИТЬ ЭТО
        gender: gender,    // <--- ДОБАВИТЬ ЭТО
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

// --------------------------------------------------------------------------------------------------------------------

// Initialize language on load
window.addEventListener('DOMContentLoaded', () => {
    updateLanguage();
});

// Helper for dynamic translations
function getTrans(key) {
    return translations[currentLang][key] || key;
}

// --- THEME LOGIC START ---
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = themeBtn.querySelector('i');
const htmlEl = document.documentElement;

function applyTheme(isDark) {
    if (isDark) {
        htmlEl.classList.add('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        htmlEl.classList.remove('dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    applyTheme(true);
} else {
    applyTheme(false);
}

themeBtn.addEventListener('click', () => {
    if (htmlEl.classList.contains('dark')) {
        localStorage.theme = 'light';
        applyTheme(false);
    } else {
        localStorage.theme = 'dark';
        applyTheme(true);
    }
});
// --- THEME LOGIC END ---

// --- 1. NAV LOGIC ---
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');
    const icon = document.getElementById('menu-icon');
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        overlay.classList.remove('active');
        icon.className = "fas fa-bars text-2xl";
        document.body.style.overflow = "auto";
    } else {
        menu.classList.add('active');
        overlay.classList.add('active');
        icon.className = "fas fa-times text-2xl";
        document.body.style.overflow = "hidden";
    }
}

function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(pageId + '-page');
    if(page) page.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- 2. CALCULATOR LOGIC ---
let ReTryBut = 0;

// "Send" function alias, in case it's used elsewhere
function send() { showData(); }

function clearResult(){
    document.getElementById('confirm-buttons').classList.add('hidden');
    document.getElementById('resultArea').classList.add('hidden');
    document.getElementById('vitamin-section').classList.add('hidden');
    document.getElementById('macros-section').classList.add('hidden');
    document.getElementById('sleep-section').classList.add('hidden');
    document.getElementById('water-section').classList.add('hidden');
    document.getElementById('calc-error-msg').classList.add('hidden');
}

function reTry(){
    ReTryBut=0;
    clearResult();
}

// This function is called when data is confirmed to show results on the SAME page
function showResultsInPlace() {
        ReTryBut=0;
        document.getElementById('confirm-buttons').classList.add('hidden');
        calculateAndDisplay();
}

function IMT(){
    const height = Number(document.getElementById('height').value);
    const weight = Number(document.getElementById('weight').value);
    if(!height||!weight) return NaN;
    return Number((weight/((height/100)**2)).toFixed(2));
}

function IMT_Interpretation(imt_value){
    if(!isFinite(imt_value)) return getTrans('imt_no_data');
    if(imt_value<16) return getTrans('imt_severe_def');
    if(imt_value<18.5) return getTrans('imt_def');
    if(imt_value<25) return getTrans('imt_norm');
    if(imt_value<30) return getTrans('imt_pre_obese');
    return getTrans('imt_obese');
}

function BMR(age,height,weight,gender,activity){
    age=Number(age);height=Number(height);weight=Number(weight);
    const multipliers={very_high:1.9,high:1.725,medium:1.55,small:1.375,low:1.2};
    let bmr = (10*weight)+(6.25*height)-(5*age)+(gender==='male'?5:-161);
    return bmr*(multipliers[activity]??1.55);
}

function proteins(activity,weight){const m={very_high:2,high:1.8,medium:1.4,small:1.2,low:0.8}; return Number(weight)*(m[activity]??1.4)}
function fat(brm_last){return (0.3*brm_last)/9}
function carb(brm_last, proteins, fat){
    const proteinKcal = proteins * 4;
    const fatKcal = fat * 9;
    const carbKcal = brm_last - proteinKcal - fatKcal;
    const carbGrams = carbKcal / 4;
    return carbGrams;
}

function vitamins(age,gender,weight,activity){
    age=Number(age);weight=Number(weight);
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

function getSleepRecommendation(age) {
    const h = getTrans('hours');
    if (age >= 1 && age <= 2) return `13 ${h}`;
    if (age >= 3 && age <= 5) return `12 ${h}`;
    if (age >= 6 && age <= 13) return `10 ${h}`;
    if (age >= 14 && age <= 17) return `9 ${h}`;
    if (age >= 18 && age <= 25) return `8 ${h}`;
    if (age >= 26 && age <= 64) return `8 ${h}`;
    if (age >= 65) return `7 ${h}`;
    if (age < 1 && age >= 0) return `14-17 ${h}`;
    return `8 ${h}`;
}

function getWaterRecommendation(weight) {
    const water = weight * 0.033;
    return water.toFixed(2) + " " + getTrans('liters');
}

function showData(){
    const ageRaw = document.getElementById('age').value;
    const heightRaw = document.getElementById('height').value;
    const weightRaw = document.getElementById('weight').value;
    const allergy = document.getElementById('allergy').value; 
    const health = document.getElementById('health').value;   

    const age = Number(ageRaw), height = Number(heightRaw), weight = Number(weightRaw);
    
    // Validation
    if(!ageRaw||!heightRaw||!weightRaw){
        document.getElementById('calc-error-msg').innerText = getTrans('err_fill');
        document.getElementById('calc-error-msg').classList.remove('hidden');
        return;
    }
    document.getElementById('calc-error-msg').classList.add('hidden');

    // Suspicious data check
    if(((age>100||height>210||weight>200)||(age<=1||height<=35||weight<=2)) && ReTryBut==0){
            document.getElementById('calc-error-msg').innerText = getTrans('err_sus');
            document.getElementById('calc-error-msg').classList.remove('hidden');
            document.getElementById('confirm-buttons').classList.remove('hidden');
            ReTryBut=1; 
            return;
    }

    // Valid data proceed - show results immediately (restored behavior)
    ReTryBut=0;
    document.getElementById('confirm-buttons').classList.add('hidden');
    calculateAndDisplay();
}

function calculateAndDisplay() {
        const age = Number(document.getElementById('age').value);
        const height = Number(document.getElementById('height').value);
        const weight = Number(document.getElementById('weight').value);
        const gender = document.querySelector('input[name="gender"]:checked')?.value || 'male';
        const activity = document.querySelector('input[name="activity"]:checked')?.value || 'medium';
        const allergy = document.getElementById('allergy').value; 
        const health = document.getElementById('health').value;   
        
        document.getElementById('resultArea').classList.remove('hidden');

    try{
        const bmrVal = BMR(age,height,weight,gender,activity);
        const imtVal = IMT();
        const sleepRec = getSleepRecommendation(age);
        const waterRec = getWaterRecommendation(weight);

        const calVal = Number(bmrVal).toFixed(0);
        const protVal = Number(proteins(activity,weight)).toFixed(0);
        const fatVal = Number(fat(bmrVal)).toFixed(0);
        const carbVal = Number(carb(bmrVal, protVal, fatVal)).toFixed(0);

        const macrosHTML = `
            <div class="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                <div class="text-orange-500 text-2xl mb-2"><i class="fas fa-fire"></i></div>
                <div class="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">${getTrans('macros_cal')}</div>
                <div class="text-lg font-bold text-gray-900 dark:text-white">${calVal}</div>
            </div>
            <div class="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <div class="text-blue-500 text-2xl mb-2"><i class="fas fa-dumbbell"></i></div>
                <div class="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">${getTrans('macros_prot')}</div>
                <div class="text-lg font-bold text-gray-900 dark:text-white">${protVal} g</div>
            </div>
            <div class="flex flex-col items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-100 dark:border-yellow-900/30">
                <div class="text-yellow-500 text-2xl mb-2"><i class="fas fa-tint"></i></div>
                <div class="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">${getTrans('macros_fat')}</div>
                <div class="text-lg font-bold text-gray-900 dark:text-white">${fatVal} g</div>
            </div>
            <div class="flex flex-col items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                <div class="text-amber-500 text-2xl mb-2"><i class="fas fa-bread-slice"></i></div>
                <div class="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">${getTrans('macros_carb')}</div>
                <div class="text-lg font-bold text-gray-900 dark:text-white">${carbVal} g</div>
            </div>  
        `;
        document.getElementById('macros-grid-container').innerHTML = macrosHTML;
        document.getElementById('macros-section').classList.remove('hidden');

        // IMT
        const imtStatus = IMT_Interpretation(imtVal);
        let statusColorClass = 'text-gray-700';
        let statusBgClass = 'bg-gray-100';

        if (imtVal < 18.5) {
            statusColorClass = 'text-blue-600'; statusBgClass = 'bg-blue-100 dark:bg-blue-900/30';
        } else if (imtVal < 25) {
            statusColorClass = 'text-green-600'; statusBgClass = 'bg-green-100 dark:bg-green-900/30';
        } else if (imtVal < 30) {
            statusColorClass = 'text-orange-500'; statusBgClass = 'bg-orange-100 dark:bg-orange-900/30';
        } else {
            statusColorClass = 'text-red-600'; statusBgClass = 'bg-red-100 dark:bg-red-900/30';
        }

        document.getElementById('imt-display').innerHTML = `
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span class="text-xl font-bold dark:text-gray-200">${getTrans('card_imt')}: <span class="text-2xl">${imtVal}</span></span>
                <span class="px-4 py-2 rounded-xl font-bold border ${statusColorClass} ${statusBgClass} border-current shadow-sm transition-all duration-300">
                    ${imtStatus}
                </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 mt-4 dark:bg-gray-700 overflow-hidden shadow-inner">
                <div class="h-3 rounded-full transition-all duration-1000 ease-out ${statusColorClass.replace('text-', 'bg-')}" style="width: ${Math.min((imtVal / 40) * 100, 100)}%"></div>
            </div>
        `;

        let extraInfo = '';
        if(allergy) extraInfo += `${getTrans('lbl_allergy')}: ${allergy}\n`;
        if(health) extraInfo += `${getTrans('lbl_health')}: ${health}`;
        document.getElementById('text-info').innerText = extraInfo;

        document.getElementById('sleep-value').innerText = sleepRec;
        document.getElementById('sleep-section').classList.remove('hidden');
        
        document.getElementById('water-value').innerText = waterRec;
        document.getElementById('water-section').classList.remove('hidden');

        const vitaminInfo = {
            Vitamin_C: {
                name: "Vitamin C", unit: "mg", icon: "lemon", color: "text-orange-500",
                desc: getTrans('vit_c_desc'),
                info_desc: (val) => { const grams = (val / 53 * 100).toFixed(0); return `${getTrans('vit_approx')} ${grams} ${getTrans('vit_lemon')}`; }
            },
            Vitamin_D: {
                name: "Vitamin D", unit: "IU", icon: "sun", color: "text-yellow-500",
                desc: getTrans('vit_d_desc'),
                info_desc: (val) => { const grams = (val / 526 * 100).toFixed(0); return `${getTrans('vit_approx')} ${grams} ${getTrans('vit_salmon')}`; }
            },
            Vitamin_A: {
                name: "Vitamin A", unit: "mcg", icon: "eye", color: "text-green-500",
                desc: getTrans('vit_a_desc'),
                info_desc: (val) => { const grams = (val / 835 * 100).toFixed(0); return `${getTrans('vit_approx')} ${grams} ${getTrans('vit_carrot')}`; }
            },
            Vitamin_B1: {
                name: "Vitamin B1", unit: "mg", icon: "bolt", color: "text-red-500",
                desc: getTrans('vit_b1_desc'),
                info_desc: (val) => { const grams = (val / 0.8 * 100).toFixed(0); return `${getTrans('vit_approx')} ${grams} ${getTrans('vit_pork')}`; }
            },
            Vitamin_B6: {
                name: "Vitamin B6", unit: "mg", icon: "capsules", color: "text-purple-500",
                desc: getTrans('vit_b6_desc'),
                info_desc: (val) => { const grams = (val / 1.0 * 100).toFixed(0); return `${getTrans('vit_approx')} ${grams} ${getTrans('vit_tuna')}`; }
            },
            Vitamin_B12: {
                name: "Vitamin B12", unit: "mcg", icon: "brain", color: "text-pink-500",
                desc: getTrans('vit_b12_desc'),
                info_desc: (val) => { const grams = (val / 20 * 100).toFixed(0); return `${getTrans('vit_approx')} ${grams} ${getTrans('vit_liver')}`; }
            }
        };
        
        const vitaminValues = vitamins(age, gender, weight, activity);
        let cardsHTML = '';
        for (const key in vitaminValues) {
            const val = vitaminValues[key];
            const info = vitaminInfo[key];
            cardsHTML += `
                <div class="vit-item bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 border border-gray-100 transition-colors duration-300">
                    <div class="vit-icon-box ${info.color}"><i class="fas fa-${info.icon}"></i></div>
                    <div>
                        <h5 class="font-bold text-sm text-gray-800 dark:text-gray-100">${info.name}</h5>
                        <p class="font-bold text-gray-900 dark:text-white">${val.toFixed(2)} ${info.unit}</p>
                        <h6 class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ${info.desc}<br>
                        <span class="italic">${info.info_desc(val)}</span>
                        </h6>
                    </div>
                </div>`;
        }
        document.getElementById('vitamin-grid-container').innerHTML = cardsHTML;
        document.getElementById('vitamin-section').classList.remove('hidden');

        const resultsBtn = document.getElementById('results-section');
        resultsBtn.classList.remove('hidden');
    } catch(err){ console.error(err); }
}

// --- 3. ADMIN PANEL LOGIC ---
let isAdmin = false;
let selectedElement = null;
let isDragging = false;
let isResizing = false;
let startX, startY, startLeft, startTop, startWidth, startHeight;

const historyStack = [];
let historyIndex = -1;

function openAdminAuth() {
    setTimeout(() => {
        const pass = prompt("Пароль:", "Admin_GPT");
        if (pass === "Admin_GPT") toggleAdmin(true);
        else alert("Невірний пароль");
    }, 100);
}

function toggleAdmin(active) {
    isAdmin = active;
    const panel = document.getElementById('admin-panel');
    if (active) {
        panel.classList.add('active');
        if (historyStack.length === 0) saveState();
        updateSiteControls();
    } else {
        panel.classList.remove('active');
        deselect();
    }
}

function saveState() {
    if (!isAdmin) return;
    const content = document.getElementById('content-area').innerHTML;
    const rootStyle = getComputedStyle(document.documentElement);
    const siteStyles = {
        '--site-color-top': rootStyle.getPropertyValue('--site-color-top'),
        '--site-color-bot': rootStyle.getPropertyValue('--site-color-bot'),
        '--site-gradient-angle': rootStyle.getPropertyValue('--site-gradient-angle')
    };
    historyStack.push({ content, siteStyles });
    historyIndex++;
}

function updateSiteGradient() {
    const top = document.getElementById('site-color-top').value;
    const bot = document.getElementById('site-color-bot').value;
    const angle = document.getElementById('site-gradient-angle').value;
    
    document.documentElement.style.setProperty('--site-color-top', top);
    document.documentElement.style.setProperty('--site-color-bot', bot);
    document.documentElement.style.setProperty('--site-gradient-angle', angle + 'deg');
}

function updateSiteControls() {
    const style = getComputedStyle(document.documentElement);
    document.getElementById('site-color-top').value = style.getPropertyValue('--site-color-top').trim();
    document.getElementById('site-color-bot').value = style.getPropertyValue('--site-color-bot').trim();
}

document.getElementById('site-color-top').oninput = updateSiteGradient;
document.getElementById('site-color-bot').oninput = updateSiteGradient;
document.getElementById('site-gradient-angle').oninput = updateSiteGradient;

document.getElementById('add-card-struct').onclick = () => {
    let grid = document.querySelector('.page-content.active .grid');
    if (!grid) grid = document.getElementById('diag-grid');
    if (!grid) { alert("Не знайдено сітки (grid)."); return; }

    const card = document.createElement('div');
    card.className = 'card'; 
    card.style.setProperty('--card-color-top', '#667eea');
    card.style.setProperty('--card-color-bot', '#764ba2');
    
    card.innerHTML = `
        <img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500&auto=format&fit=crop" class="card-image" alt="New">
        <div class="card-content">
            <h2 class="editable-text">Заголовок</h2>
            <p class="editable-text">Ваш опис тут.</p>
        </div>
    `;
    grid.appendChild(card);
    saveState();
};

document.getElementById('add-hero-banner').onclick = () => createMovableElement('hero', '');
document.getElementById('add-float-text').onclick = () => createMovableElement('text', 'Ваш текст');
document.getElementById('add-float-img').onclick = () => {
    const url = prompt("URL:", "https://source.unsplash.com/random/200x200");
    if(url) createMovableElement('img', url);
};

function createMovableElement(type, content) {
    const container = document.querySelector('.page-content.active .container') || document.body;
    const box = document.createElement('div');
    box.className = 'movable-box';
    box.style.left = '50px'; box.style.top = '100px';
    
    const inner = document.createElement('div');
    inner.className = 'movable-content';

    if (type === 'text') {
        inner.innerText = content;
        inner.style.padding = '10px';
        inner.style.background = 'white';
        inner.classList.add('editable-text');
        box.style.width = '200px';
    } else if (type === 'img') {
        const img = document.createElement('img');
        img.src = content; img.style.width='100%'; img.style.height='100%';
        inner.appendChild(img);
        box.style.width = '200px'; box.style.height = '200px';
    } else if (type === 'hero') {
        box.style.width = '100%'; box.style.maxWidth = '800px'; box.style.height = '250px';
        inner.classList.add('hero-banner-style'); 
        inner.innerHTML = `
            <img src="" class="hero-banner-img" style="display: none;">
            <h2 class="editable-text text-2xl font-bold">Здорове харчування</h2>
            <p class="editable-text">Ваш шлях до ідеальної форми.</p>
        `;
    }
    
    const handle = document.createElement('div');
    handle.className = 'resize-handle';
    box.appendChild(inner); box.appendChild(handle);
    container.appendChild(box);
    selectElement(box);
    saveState();
}

function selectElement(el) {
    if(selectedElement && selectedElement !== el) deselect();
    selectedElement = el;
    
    document.querySelectorAll('.selected-element').forEach(e => e.classList.remove('selected-element'));
    el.classList.add('selected-element');
    document.getElementById('style-controls').classList.add('active');

    document.getElementById('card-style-controls').style.display = 'none';
    document.getElementById('hero-style-controls').style.display = 'none';

    if (el.classList.contains('card')) {
        document.getElementById('card-style-controls').style.display = 'block';
        const topVal = el.style.getPropertyValue('--card-color-top') || '#667eea';
        const botVal = el.style.getPropertyValue('--card-color-bot') || '#764ba2';
        document.getElementById('card-color-top').value = rgbToHex(topVal.trim());
        document.getElementById('card-color-bot').value = rgbToHex(botVal.trim());
        const img = el.querySelector('img');
        if(img) document.getElementById('card-img-url').value = img.src;
    }

    if (el.classList.contains('movable-box') && el.querySelector('.hero-banner-style')) {
        document.getElementById('hero-style-controls').style.display = 'block';
        const heroInner = el.querySelector('.hero-banner-style');
        const hTop = heroInner.style.getPropertyValue('--hero-bg-top') || '#42a5f5';
        const hBot = heroInner.style.getPropertyValue('--hero-bg-bot') || '#26a69a';
        document.getElementById('hero-grad-top').value = rgbToHex(hTop.trim());
        document.getElementById('hero-grad-bot').value = rgbToHex(hBot.trim());
        const heroImg = heroInner.querySelector('.hero-banner-img');
        if (heroImg && heroImg.src && heroImg.style.display !== 'none') {
            document.getElementById('hero-img-url').value = heroImg.src;
        } else {
            document.getElementById('hero-img-url').value = '';
        }
    }
}

function deselect() {
    if (selectedElement) {
        selectedElement.classList.remove('selected-element');
        if (selectedElement.isContentEditable) selectedElement.contentEditable = "false";
        selectedElement = null;
        document.getElementById('style-controls').classList.remove('active');
    }
}

function initFonts() {
    const fonts = ["Montserrat", "Roboto", "Open Sans", "Oswald", "Pacifico", "Lobster", "Comfortaa", "Arial", "Inter", "Poppins", "Lato", "Nunito", "Raleway", "Ubuntu", "Bebas Neue", "Anton", "Playfair Display", "Cinzel", "Dancing Script", "Great Vibes", "Indie Flower"];
    const sel = document.getElementById('font-select');
    fonts.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f; opt.innerText = f;
        sel.appendChild(opt);
    });
}
initFonts();

function rgbToHex(rgb) {
    if(!rgb || rgb.includes('rgba(0, 0, 0, 0)') || rgb === 'transparent') return "#ffffff";
    if(rgb.startsWith('#')) return rgb;
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    let rgbArr = rgb.substr(4).split(")")[0].split(sep);
    if (rgbArr.length === 4) rgbArr.pop();
    let r = (+rgbArr[0]).toString(16), g = (+rgbArr[1]).toString(16), b = (+rgbArr[2]).toString(16);
    if(r.length==1)r="0"+r; if(g.length==1)g="0"+g; if(b.length==1)b="0"+b;
    return "#" + r + g + b;
}

document.addEventListener('mousedown', (e) => {
    if (!isAdmin) return;
    const target = e.target;
    if (target.closest('#admin-panel')) return;

    // 1. Спочатку перевіряємо resize (щоб працювало на будь-якому елементі)
    if (target.classList.contains('resize-handle')) {
        e.preventDefault(); e.stopPropagation(); isResizing = true;
        selectedElement = target.parentElement;
        startX = e.clientX; startY = e.clientY;
        startWidth = selectedElement.offsetWidth; startHeight = selectedElement.offsetHeight;
        return;
    }

    // 2. ПОТІМ перевіряємо текст (це дозволяє редагувати текст ВСЕРЕДИНІ карток)
    if (target.classList.contains('editable-text')) {
            selectElement(target); 
            target.contentEditable = "true"; 
            target.focus(); 
            return; // Виходимо, щоб не спрацював drag/drop батьківського елемента
    }

    // 3. Рухомі бокси
    const box = target.closest('.movable-box');
    if (box) {
        e.preventDefault(); selectElement(box); isDragging = true;
        startX = e.clientX; startY = e.clientY;
        startLeft = box.offsetLeft; startTop = box.offsetTop;
        return;
    }

    // 4. Картки
    const card = target.closest('.card');
    if(card) { 
        e.preventDefault(); selectElement(card); return; 
    }

    deselect();
});

document.addEventListener('mousemove', (e) => {
    if (!isAdmin) return;
    if (isDragging && selectedElement) {
        const dx = e.clientX - startX; const dy = e.clientY - startY;
        selectedElement.style.left = (startLeft + dx) + 'px';
        selectedElement.style.top = (startTop + dy) + 'px';
    }
    if (isResizing && selectedElement) {
        const dx = e.clientX - startX; const dy = e.clientY - startY;
        selectedElement.style.width = (startWidth + dx) + 'px';
        selectedElement.style.height = (startHeight + dy) + 'px';
    }
});

document.addEventListener('mouseup', () => { isDragging = false; isResizing = false; });

function applyStyle(prop, val) {
    if (!selectedElement) return;
    let target = selectedElement;
    if (selectedElement.classList.contains('movable-box')) target = selectedElement.querySelector('.movable-content');
    target.style[prop] = val;
}

function updateCSSVar(el, varName, val) { if(!el) return; el.style.setProperty(varName, val); }

document.getElementById('color-text').oninput = (e) => applyStyle('color', e.target.value);
document.getElementById('font-size-input').onchange = (e) => applyStyle('fontSize', e.target.value + 'px');
document.getElementById('font-select').onchange = (e) => applyStyle('fontFamily', e.target.value);
document.getElementById('color-bg').oninput = (e) => applyStyle('backgroundColor', e.target.value);
document.getElementById('btn-no-bg').onclick = () => { document.getElementById('color-bg').value='#000000'; applyStyle('backgroundColor', 'transparent'); }
document.getElementById('btn-delete').onclick = () => { if(selectedElement) selectedElement.remove(); deselect(); };

document.getElementById('card-color-top').oninput = (e) => updateCSSVar(selectedElement, '--card-color-top', e.target.value);
document.getElementById('card-color-bot').oninput = (e) => updateCSSVar(selectedElement, '--card-color-bot', e.target.value);
document.getElementById('card-img-url').oninput = (e) => {
    if (!selectedElement || !selectedElement.classList.contains('card')) return;
    const img = selectedElement.querySelector('img');
    if(img && e.target.value.trim() !== "") img.src = e.target.value;
};

document.getElementById('hero-grad-top').oninput = (e) => {
    const inner = selectedElement.querySelector('.hero-banner-style');
    updateCSSVar(inner, '--hero-bg-top', e.target.value);
};
document.getElementById('hero-grad-bot').oninput = (e) => {
    const inner = selectedElement.querySelector('.hero-banner-style');
    updateCSSVar(inner, '--hero-bg-bot', e.target.value);
};
document.getElementById('hero-img-url').oninput = (e) => {
    const inner = selectedElement.querySelector('.hero-banner-style');
    if (!inner) return;
    let img = inner.querySelector('.hero-banner-img');
    if (e.target.value.trim() !== "") {
        img.src = e.target.value; img.style.display = 'block';
    } else { img.style.display = 'none'; }
};
function closeDisclaimer() {
    const overlay = document.getElementById('disclaimer-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
}