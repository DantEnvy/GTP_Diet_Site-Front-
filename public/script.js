
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

    return base * (multipliers[activity] ?? 1.55);
}

// ===============================
// НАДСИЛАННЯ ДАНИХ НА БЕКЕНД
// ===============================
async function send() {
    const age = document.getElementById("age").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const gender = document.getElementById("gender").value;
    const activity = document.getElementById("activity").value;
    const allergy = document.getElementById("allergy").value;
    const health = document.getElementById("health").value;

    if (!age || !height || !weight) {
        alert("Заповніть всі обовʼязкові поля!");
        return;
    }

    // ===============================
    // РОЗРАХУНКИ
    // ===============================
    const proteinMult = 1.6; // стандарт
    const bmrVal = calculateBMR(age, height, weight, gender, activity);

    // Створюємо об'єкт з даними для відправки
    const requestData = {
        bmr: Math.round(bmrVal),
        protein: Math.round(weight * proteinMult),
        fat: Math.round((0.3 * bmrVal) / 9),
        carb: Math.round((0.4 * bmrVal) / 4),
        allergy: allergy || "немає",
        health: health || "немає"
    };

    console.log("POST DATA:", requestData);

    const resultDiv = document.getElementById("result");
    resultDiv.innerText = "⏳ Генеруємо меню, зачекайте...";
    resultDiv.style.color = "blue";

    // ===============================
    // API URL
    // Важливо: Якщо в server.js шлях app.post('/', ...), то тут теж має бути корінь
    // ===============================
    const apiUrl =
        location.hostname === "localhost" || location.hostname === "127.0.0.1"
            ? "http://localhost:3000"
            : "https://back-end-daij.onrender.com";

    try {
        // ВІДПРАВЛЯЄМО ЗАПИТ НА БЕКЕНД
        const response = await fetch(apiUrl, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // ВИПРАВЛЕННЯ: передаємо вже готовий об'єкт requestData
            body: JSON.stringify(requestData) 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Відображення результату
        if (data.diet) {
            // ВИПРАВЛЕННЯ: Виводимо текст на екран, а не тільки в консоль
            resultDiv.style.color = "black";
            // Якщо ви хочете відобразити Markdown красиво, можна використати бібліотеку marked.js,
            // але поки просто текст:
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