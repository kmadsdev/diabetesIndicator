document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("surveyForm");
    const bmiType = document.getElementById("bmiType");
    const weightInput = document.getElementById("weightInput");
    const heightInput = document.getElementById("heightInput");
    const bmiHidden = document.getElementById("BMI");
    const bmiResult = document.getElementById("bmiResult");
    const resultDiv = document.getElementById("result");

    // --- Button selection logic ---
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

    // --- BMI calculation ---
    function calculateBMI() {
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);
        const type = bmiType.value;

        if (!weight || !height) {
        bmiResult.textContent = "";
        bmiHidden.value = "";
        return;
        }

        let bmi = 0;
        if (type === "metric") {
        bmi = weight / Math.pow(height / 100, 2);
        } else {
        bmi = (weight / Math.pow(height, 2)) * 703;
        }

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

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const inputs = Array.from(formData.values()).join(",");

        try {
            const response = await fetch(`http://localhost:8000/predict?inputs=${inputs}`);
            if (!response.ok) throw new Error("API connection failed");

            const data = await response.json();
            resultDiv.textContent = data.prediction === 1
                ? `You may have diabetes (${data.confidence}% confidence). Please see a doctor.`
                : `You likely don't have diabetes (${data.confidence}% confidence).`;
        } catch (err) {
        resultDiv.textContent = "Error connecting to API.";
        }
    });
});
