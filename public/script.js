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














// --- TRANSLATION LOGIC START ---
const translations = {
    uk: {
        "disclaimer_title": "УВАГА!",
        "disclaimer_text_1": "Вся інформація, розміщена на даному сайті, надається виключно з інформаційною та ознайомчою метою. Матеріали сайту не є медичною консультацією, не є діагнозом, не є рекомендацією до лікування, не є індивідуальним планом харчування та не можуть замінити консультацію лікаря, дієтолога або іншого кваліфікованого спеціаліста.",
        "disclaimer_text_2": "Адміністрація сайту не несе відповідальності за будь-які наслідки, прямі або непрямі, що можуть виникнути в результаті використання інформації з цього сайту.",
        "disclaimer_btn": "Я підтверджую усе",
        "menu_home": "Головна",
        "menu_info": "Інформація",
        "menu_info_sub_1": "Тарілка та піраміда для здорового харчування",
        "menu_info_sub_2": "Вуглеводи",
        "menu_info_sub_3": "Білок",
        "menu_info_sub_4": "Жири та холестерин",
        "menu_info_sub_5": "Овочі та фрукти",
        "menu_info_sub_6": "Вітаміни та мінерали",
        "menu_calc": "Калькулятор",
        "menu_diet": "Дієта",
        "menu_admin": "Адмін Панель",
        "hero_subtitle": "Ваш персональний шлях до здоров'я та ідеальної форми.",
        "hero_btn": "Почати розрахунок",
        "section_diag": "Комплексна діагностика",
        "card_imt": "Тарілка харчування",
        "card_imt_desc": "Це модель для балансу в раціоні: половину порції мають складати овочі та фрукти. Іншу половину слід порівну розділити між корисними білками та цілозерновими гарнірами.",
        "card_carb": "Вуглеводи",
        "card_carb_desc": "Це головне джерело енергії, тому надавайте перевагу цілозерновим продуктам, які дають тривалу ситість. Намагайтеся мінімізувати вживання цукру та білого борошна.",
        "card_vit": "Вітаміни",
        "card_vit_desc": "Підбір нутрієнтів.",
        "card_prot": "Білок",
        "card_prot_desc": "Основний будівельний матеріал для м’язів та клітин організму. Найкращими джерелами є риба, птиця, бобові та горіхи.",
        "world_title": "Світ Nutriway",
        "world_subtitle": "Глибоке розуміння вашого тіла.",
        "feature_1_title": "Нутриціологія",
        "feature_1_desc": "Ми вивчаємо, як кожен нутрієнт впливає на енергію.",
        "feature_2_title": "Розумна Дієта",
        "feature_2_desc": "Правило 80/20: 80% корисної їжі та 20% для душі.",
        "water_title": "Гідратація — це база",
        "water_desc": "Вода регулює температуру тіла, виводить токсини та покращує роботу мозку. Навіть 2% дефіциту води знижують вашу продуктивність наполовину.",
        "water_card1_title": "30-35 мл",
        "water_card1_desc": "на 1 кг ваги — ваша ідеальна норма чистої води на добу.",
        "water_card2_title": "Склянка зранку",
        "water_card2_desc": "одразу після пробудження, щоб \"запустити\" травну систему.",
        "water_card3_title": "Без цукру",
        "water_card3_desc": "кава та соки — це їжа, а не вода. Віддавайте перевагу чистому ресурсу.",
        "faq_title": "Енциклопедія Nutriway",
        "faq_subtitle": "Ми зібрали відповіді на найскладніші та найважливіші питання про здоров’я",
        "faq_q1": "● Чи справді потрібно пити 2 літри води?",
        "faq_a1": "Ні, концепція «2 літри» є застарілою. Ваша норма залежить від ваги, рівня активності та клімату.",
        "faq_q2": "● Чи справді треба не їсти коли ти на дієті?",
        "faq_a2": "Ні, треба їсти менше калорій ніж ти використовуєш.",
        "info_title": "Корисна Інформація",
        "info_subtitle": "Дізнайтеся більше про те, як працює ваш організм та які звички допоможуть вам почуватися краще.",
        "tag_food": "ХАРЧУВАННЯ",
        "tag_sport": "СПОРТ",
        "article_1_title": "Правило тарілки",
        "article_1_desc": "Уявіть свою тарілку розділеною на частини. Половину повинні займати овочі та зелень, чверть — якісний білок (риба, м'ясо, яйця), а ще чверть — складні вуглеводи (каші, цільнозерновий хліб). Такий підхід забезпечує баланс без підрахунку калорій.",
        "article_2_title": "Чому важлива активність?",
        "article_2_desc": "Рух — це не тільки про спалювання калорій. Регулярна активність знижує рівень кортизолу (гормону стресу), покращує чутливість до інсуліну та зміцнює серцево-судинну систему. Навіть 30 хвилин ходьби на день можуть змінити ваше життя.",
        "mission_title": "Наша Місія",
        "mission_desc": "Nutriway створений для того, щоб зробити здоровий спосіб життя доступним та зрозумілим. Ми віримо, що здоров'я починається з розуміння потреб власного тіла, а не з жорстких обмежень.",
        "calc_params": "Ваші параметри",
        "lbl_age": "ВІК (років)",
        "lbl_height": "ЗРІСТ (см)",
        "lbl_weight": "ВАГА (кг)",
        "lbl_sex": "СТАТЬ",
        "opt_male": "Чоловік",
        "opt_female": "Жінка",
        "lbl_activity": "АКТИВНІСТЬ",
        "act_low": "Низька",
        "act_small": "Мала",
        "act_medium": "Середня",
        "act_high": "Висока",
        "act_sport": "Спорт",
        "err_fill": "Заповніть всі поля коректно!",
        "btn_calc": "РОЗРАХУВАТИ",
        "btn_correct": "Дані вірні",
        "btn_fix": "Виправити",
        "res_rec": "Рекомендації по харчуванню",
        "lbl_allergy": "АЛЕРГІЇ",
        "lbl_health": "ЗДОРОВ'Я",
        "btn_get_rec": "ОТРИМАТИ РЕКОМЕНДАЦІЇ",
        "res_main": "Основні показники",
        "res_sleep": "Рекомендований сон",
        "res_duration": "Тривалість",
        "res_water": "Рекомендована кількість води",
        "res_amount": "Кількість",
        "res_vit": "Ваша вітамінна карта",
        "copyright": "Всі права захищені",
        "hours": "годин",
        "liters": "літрів",
        "macros_cal": "Калорії",
        "macros_prot": "Білки",
        "macros_fat": "Жири",
        "macros_carb": "Вуглеводи",
        "imt_no_data": "Немає даних",
        "imt_severe_def": "Виражений дефіцит",
        "imt_def": "Дефіцит ваги",
        "imt_norm": "Норма",
        "imt_pre_obese": "Предожиріння",
        "imt_obese": "Ожиріння",
        "err_sus": "Ви впевнені у даних? Значення виглядають підозріло.",
        "vit_c_desc": "Зміцнює імунітет та допомагає засвоєнню заліза",
        "vit_d_desc": "Потрібний для кісток та імунітету",
        "vit_a_desc": "Підтримує зір і здоров’я шкіри",
        "vit_b1_desc": "Необхідний для нервової системи",
        "vit_b6_desc": "Важливий для мозку та обміну білків",
        "vit_b12_desc": "Потрібний для крові та нервів",
        "vit_approx": "Це приблизно",
        "vit_lemon": "г лимону",
        "vit_salmon": "г лосося",
        "vit_carrot": "г моркви",
        "vit_pork": "г свинини",
        "vit_tuna": "г тунця",
        "vit_liver": "г курячої печінки"
    },
    en: {
        "disclaimer_title": "ATTENTION!",
        "disclaimer_text_1": "All information on this site is provided for informational purposes only. The materials on the site are not medical advice, diagnosis, treatment recommendation, or individual nutritional plan and cannot replace consultation with a doctor, nutritionist, or other qualified specialist.",
        "disclaimer_text_2": "The site administration is not responsible for any consequences, direct or indirect, arising from the use of information from this site.",
        "disclaimer_btn": "I confirm everything",
        "menu_home": "Home",
        "menu_info": "Info",
        "menu_info_sub_1": "Healthy Eating Plate & Pyramid",
        "menu_info_sub_2": "Carbohydrates",
        "menu_info_sub_3": "Protein",
        "menu_info_sub_4": "Fats and Cholesterol",
        "menu_info_sub_5": "Vegetables and Fruits",
        "menu_info_sub_6": "Vitamins and Minerals",
        "menu_calc": "Calculator",
        "menu_diet": "Diet",
        "menu_admin": "Admin Panel",
        "hero_subtitle": "Your personal path to health and ideal shape.",
        "hero_btn": "Start Calculation",
        "section_diag": "Complex Diagnostics",
        "card_imt": "Plate and pyramid for a healthy diet",
        "card_imt_desc": "This is a model for a balanced diet: half of the portion should consist of vegetables and fruits. The other half should be equally divided between beneficial proteins and whole grain side dishes.",
        "card_carb": "Carbohydrates",
        "card_carb_desc": "This is the main source of energy, so give preference to whole grains, which provide long-lasting satiety. Try to minimize the consumption of sugar and white flour.",
        "card_vit": "Vitamins",
        "card_vit_desc": "Nutrient selection.",
        "card_prot": "Protein",
        "card_prot_desc": "The main building material for muscles and cells of the body. The best sources are fish, poultry, legumes, and nuts.",
        "world_title": "World of Nutriway",
        "world_subtitle": "Deep understanding of your body.",
        "feature_1_title": "Nutritiology",
        "feature_1_desc": "We study how each nutrient affects energy.",
        "feature_2_title": "Smart Diet",
        "feature_2_desc": "80/20 Rule: 80% healthy food and 20% for the soul.",
        "water_title": "Hydration is basic",
        "water_desc": "Water regulates body temperature, removes toxins, and improves brain function. Even a 2% water deficit reduces your productivity by half.",
        "water_card1_title": "30-35 ml",
        "water_card1_desc": "per 1 kg of weight — your ideal norm of pure water per day.",
        "water_card2_title": "Glass in the morning",
        "water_card2_desc": "immediately after waking up to \"start\" the digestive system.",
        "water_card3_title": "No sugar",
        "water_card3_desc": "coffee and juices are food, not water. Prefer pure resource.",
        "faq_title": "Nutriway Encyclopedia",
        "faq_subtitle": "We have collected answers to the most difficult and important questions about health",
        "faq_q1": "● Is it really necessary to drink 2 liters of water?",
        "faq_a1": "No, the \"2 liters\" concept is outdated. Your norm depends on weight, activity level, and climate.",
        "faq_q2": "● Should you really not eat when on a diet?",
        "faq_a2": "No, you need to eat fewer calories than you use.",
        "info_title": "Useful Information",
        "info_subtitle": "Learn more about how your body works and what habits will help you feel better.",
        "tag_food": "NUTRITION",
        "tag_sport": "SPORT",
        "article_1_title": "The Plate Rule",
        "article_1_desc": "Imagine your plate divided into parts. Half should be vegetables and greens, a quarter - high-quality protein (fish, meat, eggs), and another quarter - complex carbohydrates (porridge, whole grain bread). This approach ensures balance without counting calories.",
        "article_2_title": "Why is activity important?",
        "article_2_desc": "Movement is not just about burning calories. Regular activity lowers cortisol levels (stress hormone), improves insulin sensitivity, and strengthens the cardiovascular system. Even 30 minutes of walking a day can change your life.",
        "mission_title": "Our Mission",
        "mission_desc": "Nutriway was created to make a healthy lifestyle accessible and understandable. We believe that health begins with understanding the needs of one's own body, not with strict restrictions.",
        "calc_params": "Your parameters",
        "lbl_age": "AGE (years)",
        "lbl_height": "HEIGHT (cm)",
        "lbl_weight": "WEIGHT (kg)",
        "lbl_sex": "GENDER",
        "opt_male": "Male",
        "opt_female": "Female",
        "lbl_activity": "ACTIVITY",
        "act_low": "Low",
        "act_small": "Small",
        "act_medium": "Medium",
        "act_high": "High",
        "act_sport": "Sport",
        "err_fill": "Fill in all fields correctly!",
        "btn_calc": "CALCULATE",
        "btn_correct": "Data correct",
        "btn_fix": "Fix",
        "res_rec": "Nutrition Recommendations",
        "lbl_allergy": "ALLERGIES",
        "lbl_health": "HEALTH",
        "btn_get_rec": "GET RECOMMENDATIONS",
        "res_main": "Main Indicators",
        "res_sleep": "Recommended Sleep",
        "res_duration": "Duration",
        "res_water": "Recommended Water Amount",
        "res_amount": "Amount",
        "res_vit": "Your Vitamin Map",
        "copyright": "All rights reserved",
        "hours": "hours",
        "liters": "liters",
        "macros_cal": "Calories",
        "macros_prot": "Proteins",
        "macros_fat": "Fats",
        "macros_carb": "Carbs",
        "imt_no_data": "No data",
        "imt_severe_def": "Severe deficit",
        "imt_def": "Weight deficit",
        "imt_norm": "Norm",
        "imt_pre_obese": "Pre-obesity",
        "imt_obese": "Obesity",
        "err_sus": "Are you sure about the data? Values look suspicious.",
        "vit_c_desc": "Strengthens immunity and helps iron absorption",
        "vit_d_desc": "Needed for bones and immunity",
        "vit_a_desc": "Supports vision and skin health",
        "vit_b1_desc": "Necessary for the nervous system",
        "vit_b6_desc": "Important for brain and protein metabolism",
        "vit_b12_desc": "Needed for blood and nerves",
        "vit_approx": "This is about",
        "vit_lemon": "g lemon",
        "vit_salmon": "g salmon",
        "vit_carrot": "g carrot",
        "vit_pork": "g pork",
        "vit_tuna": "g tuna",
        "vit_liver": "g chicken liver"
    }
};

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
            btn.innerText = currentLang === 'uk' ? 'UA' : 'EN';
    }
    
    // Update all elements with data-lang-key
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.getAttribute('data-lang-key');
        if (translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });

    // Re-render calculator results if they are visible (to update dynamic text)
    if(!document.getElementById('resultArea').classList.contains('hidden')) {
        calculateAndDisplay();
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