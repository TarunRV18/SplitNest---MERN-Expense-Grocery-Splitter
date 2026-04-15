# 🏠 SplitNest – Expense Splitting App for Roommates

## 📌 Overview

SplitNest is a simple and efficient web application designed to help roommates manage and split shared expenses بسهولة. It eliminates confusion by keeping track of who owes what and ensures fair settlements.

---

## 🚀 Features

* ➕ Add shared expenses
* 👥 Split bills among roommates
* 📊 View individual balances
* 💰 Track who owes whom
* 🔄 Real-time updates (if applicable)
* 📱 Responsive and user-friendly UI

---

## 🛠️ Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js / Express.js
* **Database:** MongoDB
* **Version Control:** Git & GitHub

---

## 📂 Project Structure

```
expense-tracker/
│
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   │
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Expense.js          # Expense schema (with paidBy, splits)
│   │
│   ├── routes/
│   │   ├── authRoutes.js       # Login/Register
│   │   ├── userRoutes.js       # Users (members)
│   │   └── expenseRoutes.js    # Expenses
│   │
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT protection (optional)
│   │
│   ├── server.js               # Entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── assets/             # images/icons
│   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Card.jsx
│   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AddExpense.jsx
│   │   │   ├── Members.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx # login state
│   │
│   │   ├── services/
│   │   │   └── api.js          # Axios config
│   │
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   └── dashboard.css
│   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/TarunRV18/splitnest.git
cd splitnest
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Run the project

```
npm run dev
```

---

## 🎯 Use Case

This app is ideal for:

* Roommates sharing rent & utilities
* Friends on trips splitting costs
* Any group managing shared expenses

---

## 🔮 Future Enhancements

* 🔐 User authentication (Login/Signup)
* 📊 Expense analytics dashboard
* 🌐 Multi-currency support
* 📱 Mobile app version

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Tarun RV**

* GitHub: https://github.com/TarunRV18

---
