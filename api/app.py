from datetime import datetime
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from joblib import load
from typing import List


MODEL_DIR = Path("../trainedModels")
HOST, PORT = "0.0.0.0", 8000


def validate_inputs(values: List[float]):
    fields = [
        ("HighBP", int, [0, 1]),
        ("HighChol", int, [0, 1]),
        ("CholCheck", int, [0, 1]),
        ("BMI", float, (0, 1000)),
        ("Smoker", int, [0, 1]),
        ("Stroke", int, [0, 1]),
        ("HeartDiseaseorAttack", int, [0, 1]),
        ("PhysActivity", int, [0, 1]),
        ("Fruits", int, [0, 1]),
        ("Veggies", int, [0, 1]),
        ("HvyAlcoholConsump", int, [0, 1]),
        ("AnyHealthCare", int, [0, 1]),
        ("NoDocbcCost", int, [0, 1]),
        ("GenHlth", int, (1, 5)),
        ("DiffWalk", int, [0, 1]),
        ("Sex", int, [0, 1]),
        ("Age", int, (0, 13))
    ]

    if len(values) != len(fields):
        raise HTTPException(status_code=400, detail=f"Expected {len(fields)} inputs, got {len(values)}.")

    for i, (name, typ, rule) in enumerate(fields):
        val = values[i]
        try:
            val = typ(val)
        except:
            raise HTTPException(status_code=400, detail=f"{name} must be of type {typ.__name__}.")

        if isinstance(rule, list):
            if val not in rule:
                raise HTTPException(status_code=400, detail=f"{name} must be one of {rule}.")
        elif isinstance(rule, tuple):
            if not (rule[0] <= val <= rule[1]):
                raise HTTPException(status_code=400, detail=f"{name} must be between {rule[0]} and {rule[1]}.")

    return values


def get_latest_model_path():
    pkl_files = list(MODEL_DIR.glob("*.pkl"))
    if not pkl_files:
        raise FileNotFoundError(f"No .pkl files found in {MODEL_DIR}")

    def extract_datetime(path):
        try:
            name = path.stem
            date_str = "_".join(name.split('_')[-2:])
            return datetime.strptime(date_str, "%d-%m-%Y_%H-%M-%S")
        except Exception:
            return datetime.min

    return max(pkl_files, key=extract_datetime)


def load_model(filename):
    with open(filename, "rb") as f:
        return load(f)


app = FastAPI()

current_model_path = get_latest_model_path()
model = load_model(current_model_path)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "API is Live", "model": current_model_path.name}


@app.get("/predict")
def predict(inputs: str):
    import numpy as np
    global model, current_model_path

    latest_path = get_latest_model_path()
    if latest_path != current_model_path:
        print(f"New model detected: {latest_path.name}")
        model = load_model(latest_path)
        current_model_path = latest_path

    try:
        X = [float(x) if '.' in x else int(x) for x in inputs.split(',')]
    except ValueError:
        raise HTTPException(status_code=400, detail="All inputs must be numeric.")

    X = [validate_inputs(X)]
    proba = model.predict_proba(X)[0]
    y = int(np.argmax(proba))
    confidence = round(proba[y] * 100, 2)

    return {
        "prediction": y,
        "confidence": confidence,
        "model": current_model_path.name
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
