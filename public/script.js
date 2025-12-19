async function send() {
  const data = {
    carb: document.getElementById("carbs").value,
    bmr: document.getElementById("bmr_last").value,
    fat: document.getElementById("fats").value,
    squirrels: document.getElementById("squirrel").value,
    allergy: document.getElementById("allergy").value,
    health: document.getElementById("health").value
  };

  const res = await fetch("https://back-end-daij.onrender.com/api/diet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  document.getElementById("result").innerText = result.diet;
}

async function get(){
  const res = await fetch("https://back-end-daij.onrender.com/api/diet");
  const result = await res.json();
  document.getElementById("result").innerText = result.diet;
  localStorage.setItem('diet', result.diet);

}
window.addEventListener('load', () => {
  const savedDiet = localStorage.getItem('diet');
  if (savedDiet) {
    document.getElementById('result').innerText = savedDiet;
  }
});