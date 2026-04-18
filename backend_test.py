import requests
import json
import time

PHP_BASE_URL = "http://localhost:8000"
PYTHON_BASE_URL = "http://localhost:5000"

def test_php_health():
    print("\nTesting PHP Health Check...")
    try:
        response = requests.get(f"{PHP_BASE_URL}/api/health.php")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
        print("✅ PHP Health Check Passed")
    except Exception as e:
        print(f"❌ PHP Health Check Failed: {e}")

def test_python_health():
    print("\nTesting Python Health Check...")
    try:
        response = requests.get(f"{PYTHON_BASE_URL}/api/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
        print("✅ Python Health Check Passed")
    except Exception as e:
        print(f"❌ Python Health Check Failed: {e}")

def test_python_ai_generate():
    print("\nTesting Python AI Content Generation...")
    payload = {
        "type": "explanation",
        "topic": "Photosynthesis",
        "grade": "Grade 11"
    }
    try:
        response = requests.post(f"{PYTHON_BASE_URL}/api/ai/generate-content", json=payload)
        print(f"Status Code: {response.status_code}")
        # print(f"Response: {json.dumps(response.json(), indent=2)}")
        assert response.status_code == 200
        assert response.json()["success"] == True
        print("✅ Python AI Content Generation Passed")
    except Exception as e:
        print(f"❌ Python AI Content Generation Failed: {e}")

def test_python_physics_simulate():
    print("\nTesting Python Physics Simulation...")
    payload = {
        "experiment": "pendulum",
        "parameters": {"length": 1.0, "mass": 0.5}
    }
    try:
        response = requests.post(f"{PYTHON_BASE_URL}/api/physics/simulate", json=payload)
        print(f"Status Code: {response.status_code}")
        assert response.status_code == 200
        print("✅ Python Physics Simulation Passed")
    except Exception as e:
        print(f"❌ Python Physics Simulation Failed: {e}")

def main():
    print("🚀 Starting Backend API Tests...")
    # Wait a bit for servers to fully initialize
    time.sleep(2)
    
    test_php_health()
    test_python_health()
    test_python_ai_generate()
    test_python_physics_simulate()
    
    print("\n🏁 All basic tests completed.")

if __name__ == "__main__":
    main()
