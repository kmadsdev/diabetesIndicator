document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("surveyForm");
    const bmiType = document.getElementById("bmiType");
    const weightInput = document.getElementById("weightInput");
    const heightInput = document.getElementById("heightInput");
    const bmiHidden = document.getElementById("BMI");
    const bmiResult = document.getElementById("bmiResult");
    const resultDiv = document.getElementById("result");

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

    function validateForm() {
        let valid = true;
        let firstInvalid = null;

        form.querySelectorAll("input[type='hidden']").forEach(input => {
            if (!input.value) {
                valid = false;
                if (!firstInvalid) firstInvalid = input;
                input.closest(".question").style.border = "1px solid red";
            } else {
                input.closest(".question").style.border = "none";
            }
        });

        [weightInput, heightInput].forEach(input => {
            if (!input.value || parseFloat(input.value) <= 0) {
                valid = false;
                if (!firstInvalid) firstInvalid = input;
                input.style.border = "1px solid red";
            } else {
                input.style.border = "";
            }
        });

        form.querySelectorAll("select").forEach(select => {
            if (!select.value) {
                valid = false;
                if (!firstInvalid) firstInvalid = select;
                select.style.border = "1px solid red";
            } else {
                select.style.border = "";
            }
        });

        if (!valid) {
            alert("⚠️ Please complete all questions before submitting.");
            if (firstInvalid) firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return valid;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formData = new FormData(form);
        const inputs = Array.from(formData.values()).join(",");

        try {
            const response = await fetch(`https://diabetesindicator.onrender.com/predict?inputs=${inputs}`);
            if (!response.ok) throw new Error("API connection failed");

            const data = await response.json();
            resultDiv.style.color = data.prediction === 1 ? "#ffff00" : "#00ff00";
            resultDiv.textContent = data.prediction === 1
                ? `⚠️ You may have diabetes (${data.confidence}% confidence). Please see a doctor.`
                : `✅ You likely don't have diabetes (${data.confidence}% confidence).`;
        } catch (err) {
            resultDiv.textContent = "Error connecting to API.";
            resultDiv.style.color = "#ff0000";
        }
    });
});
