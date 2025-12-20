async function send() {
    // 1. Считываем данные
    const age = document.getElementById("age").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const gender = document.getElementById("gender").value;
    const activity = document.getElementById("activity").value; // Проверьте, что здесь выбрано!
    const allergy = document.getElementById("allergy").value;
    const health = document.getElementById("health").value;

    if (!age || !height || !weight) {
        alert("Заповніть всі обовʼязкові поля!");
        return;
    }

    // 2. Рассчитываем целевые калории (TDEE)
    // Важно: если вы хотите 2288 ккал, убедитесь, что activity выбрана 'medium', 
    // либо вручную повысьте коэффициент здесь.
    const totalCalories = calculateBMR(age, height, weight, gender, activity);

    // 3. Расчет БЖУ (Гибридный метод)
    
    // БЕЛОК: Считаем от веса. 
    // Исправляем низкие коэффициенты. Для "low" ставим хотя бы 1.2, для спорта 1.6-2.0
    const proteinMultipliers = {very_high: 2.0, high: 1.8, medium: 1.6, small: 1.4, low: 1.2};
    // Используем коэффициент из объекта или 1.2 по умолчанию
    const proteinGrams = Number(weight) * (proteinMultipliers[activity] ?? 1.2);
    const proteinKcal = proteinGrams * 4;

    // ЖИРЫ: 30% от общей калорийности
    const fatKcal = totalCalories * 0.30;
    const fatGrams = fatKcal / 9;

    // УГЛЕВОДЫ: Всё, что осталось
    const carbKcal = totalCalories - proteinKcal - fatKcal;
    const carbGrams = carbKcal / 4;

    // 4. Формируем объект
    const requestData = {
        bmr: Math.round(totalCalories),          // Калории
        protein: Math.round(proteinGrams),       // Белки (теперь адекватное число)
        fat: Math.round(fatGrams),               // Жиры
        carb: Math.round(Math.max(0, carbGrams)),// Углеводы (защита от минуса)
        
        allergy: allergy || "немає",
        health: health || "немає",
        
        // Исправленный вызов витаминов (height -> gender)
        vitamins: vitam(age, gender, weight, activity) 
    };

    console.log("POST DATA:", requestData); // Теперь тут будут правильные цифры

    // ... (Далее ваш код fetch без изменений) ...
    const resultDiv = document.getElementById("result");
    resultDiv.innerText = "⏳ Генеруємо меню, зачекайте...";
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

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        if (data.diet) {
            resultDiv.style.color = "black";
            resultDiv.innerText = data.diet; 
        } else {
            resultDiv.innerText = "Сталася помилка при генерації.";
            resultDiv.style.color = "red";
        }
    } catch (error) {
        resultDiv.innerText = "Не вдалося з'єднатися з сервером.";
        resultDiv.style.color = "red";
        console.error("Помилка fetch:", error);
    }
}