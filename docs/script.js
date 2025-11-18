document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("surveyForm");
    const bmiType = document.getElementById("bmiType");
    const weightInput = document.getElementById("weightInput");
    const heightInput = document.getElementById("heightInput");
    const bmiHidden = document.getElementById("BMI");
    const bmiResult = document.getElementById("bmiResult");
    const resultDiv = document.getElementById("result");


    // Handle button groups for options (e.g., Yes/No)
    document.querySelectorAll(".buttons").forEach(group => {
        const buttons = group.querySelectorAll("button");
        const hiddenInput = group.nextElementSibling;

        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                buttons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                hiddenInput.value = btn.dataset.value;
            });
        });
    });


    // BMI calculation
    function calculateBMI() {
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);
        const type = bmiType.value;

        if (!weight || !height) {
            bmiResult.textContent = "";
            bmiHidden.value = "";
            return;
        }

        let bmi = type === "metric"
            ? weight / Math.pow(height / 100, 2)
            : (weight / Math.pow(height, 2)) * 703;

        const category =
            bmi < 18.5 ? "Underweight" :
            bmi < 25 ? "Normal weight" :
            bmi < 30 ? "Overweight" : "Obese";

        bmiHidden.value = bmi.toFixed(1);
        bmiResult.textContent = `Your BMI is: ${bmi.toFixed(1)} — Category: ${category}`;
    }

    [weightInput, heightInput, bmiType].forEach(el =>
        el.addEventListener("input", calculateBMI)
    );

    // Form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        // Convert all inputs to numeric values
        const inputs = Array.from(formData.values())
            .map(v => v.includes('.') ? parseFloat(v) : parseInt(v))
            .join(",");

        try {
            const response = await fetch(`https:/diabetes-indicator-api.vercel.app/api/predict?inputs=${inputs}`);
            if (!response.ok) throw new Error("API connection failed");

            const data = await response.json();

            resultDiv.style.color = data.prediction === 1 ? "#ffff00" : "#00ff00";
            resultDiv.textContent = data.prediction === 1
                ? `⚠️ You may have diabetes (${data.confidence}% confidence). You might wanna see a doctor.`
                : `✅ You likely don't have diabetes (${data.confidence}% confidence).`;

            resultDiv.textContent += ` (Model: ${data.model})`;

        } catch (err) {
            resultDiv.style.color = "#ff0000";
            resultDiv.textContent = "Error connecting to API.";
            console.error(err);
        }
    });
});
