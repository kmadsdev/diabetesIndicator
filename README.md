# Diabetes Indicator
Diabetes Indicator is a survey website that asks you 17 questions to determine whether you may have diabetes.
> ⚠️ Disclaimer: This app is for informational and educational purposes only. It does not provide medical advice, diagnosis, or treatment. The results should not be taken as a medical opinion. If you have concerns about your health or the results, please consult a qualified healthcare professional.

#### DEMO
![Demo](https://raw.githubusercontent.com/kmadsdev/diabetesIndicator/main/docs/assets/media/demo-2025-11-17.gif)

#### Project Structure:
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
    ⌞ LICENSE, README.md, .gitignore, .gitattributes, ...
```

#### How it works
- The frontend (`docs` folder) is currently hosted on Github Pages in [this link](https://kmadsdev.github.io/diabetesIndicator/)
- The backend (`api` folder) is currently hosted on [render](https://render.com/) in [this link](https://diabetesindicator.onrender.com/)
- The ML models (`trainedModels` folder) are stored on github (which will be cloned to render for production)
