# Physoxy

**Physoxy** is a full-stack platform featuring **JWT authentication**, **user subscription plans**, **admin panel**, and **role-based access control**, all built with a clean, scalable architecture designed for production use.

🚀 **Live Demo:** [https://physoxy.vercel.app](https://physoxy.vercel.app)

---

## 🛠 Tech Stack

* **Frontend:** React.js, Tailwind CSS, DaisyUI
* **Backend:** Node.js, Express.js
* **Database:** MongoDB

---

## ✨ Features

### 🏗️ Production-Grade Architecture

Modular, maintainable, and scalable folder structures for both frontend and backend. Ensures easier testing, development, and deployment.

### 🎨 Theme Support

Supports both light and dark themes with user preference persistence for an enhanced and accessible UI experience.

### 💼 User Plans

Offers tiered user plans (e.g., free, premium) with customizable access to features and services depending on the selected plan. Includes upgrade/downgrade support and plan validation.

### 📧 Email Verification

Magic link-based email verification via SMTP server integration ensures secure and frictionless onboarding for users.

### 🧩 Decoupled Architecture

Frontend and backend are fully independent and can be developed, hosted, or scaled separately for better performance and maintainability.

### 🔐 JWT Authentication

Implements secure login with access and refresh tokens, allowing persistent sessions, token rotation, and secure token storage.

### 🛡️ Role-Based Resource Access

Granular access control based on user roles (e.g., user, admin). Routes and components are protected through middleware and client-side layouts to prevent unauthorized access.

---

## 🧑‍💻 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/malay77patra/Physoxy
cd Physoxy
```

### 2. Environment Setup

Create a `.env` file for both `/frontend` and `/backend` by renaming the provided `.env.template` in each folder. Fill in the required environment variables (e.g., database URI, JWT secrets, SMTP credentials).

### 3. Run the App Locally

Open two terminal windows:

**Terminal 1: Frontend**

```bash
cd frontend
npm install
npm run dev
```

**Terminal 2: Backend**

```bash
cd backend
npm install
npm run dev
```

## Test Users
Login with the below credentials to test the web app -
- malay77patra@gmail.com, Test@1234 (admin)
- 280shanna@chefalicious.com, Shan@1234

Visit the app at [http://localhost:5147](http://localhost:5147)
