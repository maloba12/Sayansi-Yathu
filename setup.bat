@echo off
echo 🧪 Setting up Sayansi Yathu Python Environment...

REM Activate virtual environment
call .venv\Scripts\activate

REM Install packages
pip install flask flask-cors pandas scikit-learn numpy

REM Test the installation
python -c "import flask; print('✅ Flask installed successfully')"

echo 🎉 Setup complete! Run: python backend-python/app.py
pause