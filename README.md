# Task Manager App

A full-stack **Task Manager** application built with **React**, **Node.js**, **Express**, and **MongoDB**. It allows users to register, log in, and manage their tasks with CRUD operations.

---

## 🚀 Features

* ✅ User authentication (JWT-based)
* 🧑‍💼 Role-based access (user / admin)
* 📋 Create, Read, Update, Delete tasks
* 🔐 Secure API with protected routes
* 🔎 Frontend and Backend fully containerized with Docker
* ✅ Unit & Integration tests using Jest + Supertest

---

## 🧱 Project Structure

assignment/
├── task-manager-frontend/   # React frontend (port 3000)
├── task-manager-backend/    # Node.js + Express API (port 5000)
├── docker-compose.yml       # Docker Compose setup
└── README.md


---

## 🛠️ Setup & Run Locally

### 1. Prerequisites

* [Node.js](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com/)
* [Docker](https://www.docker.com/) (optional but recommended)

### 2. Clone the repo

bash
git clone https://github.com/jatin-singh-kushwaha/Task-manager-jatin.git
cd Task-manager-jatin


### 3. Run with Docker (recommended)

bash
docker compose up --build


Then visit:

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:5000/api](http://localhost:5000/api)

> **Note:** Ensure Docker is installed and running on your system.

### 4. Run manually without Docker

#### Backend

bash
cd task-manager-backend
npm install
npm run dev


#### Frontend

bash
cd task-manager-frontend
npm install
npm start


---

## 🧪 Running Tests

Inside the backend folder:

bash
npm test


> Jest and Supertest are used to test the authentication and task APIs.

---

## 🐳 Docker Compose Overview

The app uses docker-compose to set up:

* frontend container (React App)
* backend container (Express server)
* mongo container (MongoDB database)

All connected and working out of the box.

---

## 🔐 .env Configuration

Create a .env file inside task-manager-backend/:

env
PORT=5000
MONGO_URI=mongodb://mongo:27017/task_manager
JWT_SECRET=supersecretkey


The frontend is preconfigured to make requests to http://localhost:5000/api

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

PRs are welcome! If you find any bug or want to improve the app, feel free to open an issue or submit a pull request.

---

## 🙋‍♂️ Author

Built with ❤️ by [Jatin Singh Kushwaha](https://github.com/jatin-singh-kushwaha)

---
