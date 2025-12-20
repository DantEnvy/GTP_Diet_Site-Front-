// Функция расчета BMR (Базовый обмен веществ)
function calculateBMR(age,height,weight,gender,activity){
    age=Number(age);height=Number(height);weight=Number(weight);
    const multipliers={very_high:1.9,high:1.725,medium:1.55,small:1.375,low:1.2};
    let bmr = (10*weight)+(6.25*height)-(5*age)+(gender==='male'?5:-161);
    return bmr*(multipliers[activity]??1.55);
}

// ... (Функція calculateBMR залишається без змін) ...

async function send() {
    const age = document.getElementById("age").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const gender = document.getElementById("gender").value;
    const activity = document.getElementById("activity").value;
    const allergy = document.getElementById("allergy").value;
    const health = document.getElementById("health").value;
    // ... (збір інших даних без змін) ...

    // Перевірка заповнення
    if (!age || !height || !weight) {
        alert("Заповніть всі поля!");
        return;
    }

    // Розрахунки
    const bmrVal = calculateBMR(age, height, weight, gender, activity);
    // ... (розрахунки макросів залишаються без змін) ...

    const requestData = {
        bmr: Math.round(bmrVal),
        protein: Math.round(weight * proteinMult),
        fat: Math.round((0.3 * bmrVal) / 9),
        carb: Math.round((0.4 * bmrVal) / 4),
        allergy: allergy,
        health: health
    };

    const resultDiv = document.getElementById("result");
    resultDiv.innerText = "Генеруємо меню... це займе кілька секунд...";
    resultDiv.style.color = "blue";

    try {
        // !!! ВАЖЛИВА ЗМІНА ТУТ !!!
        // Для локального запуску використовуємо localhost
        const apiUrl = "https://back-end-daij.onrender.com"; 
        
        const response = await fetch(apiUrl, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (response.ok && data.diet) {
            if (typeof marked !== 'undefined') {
                resultDiv.innerHTML = marked.parse(data.diet);
            } else {
                resultDiv.innerText = data.diet;
            }
            resultDiv.style.color = "black";
        } else {
            resultDiv.innerText = "Помилка: " + (data.error || "Невідома");
            resultDiv.style.color = "red";
        }

    } catch (error) {
        console.error("Помилка з'єднання:", error);
        resultDiv.innerText = "Сервер не відповідає. Перевірте, чи запущено server.js";
        resultDiv.style.color = "red";
    }
}