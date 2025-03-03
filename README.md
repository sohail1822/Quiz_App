# 🎯 Online Quiz Platform

Welcome to the Online Quiz Platform, a powerful full-stack web application built with Django REST Framework (DRF) for the backend and React + Redux for the frontend. This system allows users to participate in quizzes, track their progress, and manage quiz-related data efficiently.

##  🚀 Getting Started

Follow these steps to set up the project on your local machine.

### 📌 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

---

## Backend Setup (Django)


### 📌 2. Move into the Backend Directory

```bash
cd backend
```

### 📌 3. Set Up a Virtual Environment

# Create a virtual environment
```bash
python -m venv env
``` 

# Activate the environment (Windows)
```bash
env\Scripts\activate  
``` 
# Activate the environment (Mac/Linux)
```bash
source env/bin/activate  
``` 

###  📌 4. Install Required Packages
```bash
pip install -r requirements.txt
``` 


###  📌 5. Run Database Migrations and Start Server
```bash
python manage.py migrate
python manage.py runserver
``` 
```bash
🔹 Your Django API is now live at: http://127.0.0.1:8000/
``` 

⚛️ Frontend Setup (React)


###  📌 6. Navigate to the Frontend Folder (Open a New Terminal)
```bash
cd frontend
``` 

### 📌 7. Install Frontend Dependencies
```bash
npm install
``` 

### 📌 8. Start the Development Server
```bash
npm run dev
```
```bash
🔹 Your React App is now accessible at: http://localhost:5173/
```

---
### 📡 API Endpoints Overview

🔗 Base API URL: http://127.0.0.1:8000/api/

---
### 🔑 User Authentication
`POST /api/login/` – Authenticate a user

`POST /api/register/` – Create a new account

`GET /api/user/` – Retrieve logged-in user details

---
### 📝 Quiz Operations
`GET /api/quizzes/` – Fetch all quizzes

`POST /api/quizzes/` – Create a new quiz (Admin only)

`GET /api/quizzes/{quiz_id}/` – Get specific quiz details

---
### 🎮 Quiz Participation
`POST /api/my-quizzes/{quiz_id}/start/` – Begin a quiz session

`POST /api/my-quizzes/{quiz_id}/submit/` – Submit quiz responses

`GET /api/my-quizzes/{quiz_id}/response/` – View quiz attempt results

---
### 🛠 Admin Functionalities
`GET /api/quizzes/{quiz_id}/participants/` – List all users who attempted a quiz

`GET /api/quizzes/{quiz_id}/response/{user_id}/` – Fetch a user’s quiz responses

---

### 🏗 Tech Stack Used
🔹 Backend: Django, Django REST Framework (DRF) , PostgreSQL, JWT Authentication

🔹 Frontend: React , Redux Toolkit, Bootstrap , React Router

🔹 Additional Libraries & Tools: CORS, Axios, JWT Authentication

---

🎉 You're All Set!

Once everything is up and running, open your browser and explore the Online Quiz Platform! 🚀

Have any questions or suggestions? Feel free to contribute! ✨

