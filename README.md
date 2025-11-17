# Diabetes Indicator 
## Available at: [https://kmads.dev/diabetesIndicator/](https://kmads.dev/diabetesIndicator/)

Diabetes Indicator is a survey website that asks you 17 questions to determine whether you may have diabetes.

> **⚠️ Disclaimer:** This app is for informational and educational purposes only. It does not provide medical advice, diagnosis, or treatment. The results should not be taken as a medical opinion. If you have concerns about your health or the results, please consult a qualified healthcare professional.

### DEMO
![Demo](https://raw.githubusercontent.com/kmadsdev/diabetesIndicator/main/docs/assets/media/demo-2025-11-17.gif)

### Project Structure:
```
    diabetesIndicator
    ⊢ api/
    |  ⊢ app.py (running on render, fastapi + uvicorn)
    |  ⌞ requirements.txt (dependencies to deploy the api)
    |
    ⊢ docs/
    |  ⊢ index.html (main page)
    |  ⊢ style.css (styles for desktop)
    |  ⊢ mobile.css (styles for mobile phones)
    |  ⌞ script.js (script to connect with the backend)
    |
    ⊢ predictionModel/
    |  ⌞ ml.ipynb (Main machine learning training file)
    |
    ⊢ trainedModels/
    |  ⌞ ... (Saved models with timestamps)
    |
    ⌞ LICENSE, README.md, .gitignore, ...
```

### Infra / Architecture
- **Frontend:** `docs` is hosted on Github Pages
- **Backend:** `api` is currently hosted on Render
- **Machine Learning:** `predictionModel` & `trainedModels`

Architecture: <br>
- ***`Client`*** Request request prediction from ***`docs/` (github pages)*** 
- ***`docs/` (github pages)*** gets prediction from ***`api/` (render)***
- ***`api/` (render)*** gets the latest model (.pkl) model from ***`trainedModels/` (github)***
- ***`trainedModels/` (github)*** gets the model (.pkl) from ***`predictionModel/` (github)***

Simplified: <br>
- Client -> Frontend (docs/) -> Backend (api/) <br> 
- Backend (api/) -> trainedModels/ -> predictionModel/

![Architecture](https://raw.githubusercontent.com/kmadsdev/diabetesIndicator/main/docs/assets/infra/architecture-2025-11-17.svg)
