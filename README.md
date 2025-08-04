# 📋 Algonive Task Management for Small Teams

A full-stack task management web application designed for small teams to efficiently organize, assign, and track tasks. Built using the **MERN** stack (MongoDB, Express.js, React, Node.js), the project features a responsive frontend with robust backend APIs for task creation, deletion, and filtering.

---

## 🚀 Features

* 🔨 Add, edit, and delete tasks
* 🔍 Filter tasks by status, priority, or assigned team member
* 💡 Responsive UI built with Tailwind CSS
* 🔗 RESTful API integration with MongoDB backend
* 🛡️ Error handling and input validation
* 📁 Organized codebase with separate frontend and backend folders

---

## 🧰 Tech Stack

| Layer           | Technology                |
| --------------- | ------------------------- |
| Frontend        | React, Vite, Tailwind CSS |
| Backend         | Node.js, Express.js       |
| Database        | MongoDB                   |
| Version Control | Git + GitHub              |

---

## ⚙️ Getting Started

### Prerequisites

* Node.js and npm
* MongoDB (local or Atlas)
* Git

### Clone the Repository

```bash
git clone https://github.com/arnvj110/Algonive_Task_Management_For_Small_Teams.git
cd Algonive_Task_Management_For_Small_Teams
```

---

### 🔧 Setup Backend

```bash
cd backend_task_management

# Install backend dependencies
npm install

# Create a .env file with the following:
MONGO_URI=<your-mongo-connection-string>
JWT_SECRTET=<your-jwt-secret>
PORT=5000

# Run the server
node index.js
```

---

### 🎨 Setup Frontend

```bash
cd frontend_task_management

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

Visit: `http://localhost:5173` (or the default Vite port)


---

## 📁 Folder Structure

```
/
├── backend_task_management/
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── controllers/      # Route controllers
│   └── server.js         # Entry point
├── frontend_task_management/
│   ├── src/              # React components and pages
│   └── public/
└── README.md
```

---

## 🧪 Testing

You can use **Postman** or **Thunder Client** to test backend endpoints during development.

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes
4. Push and create a pull request

---

## 📄 License

Licensed under the MIT License.

---

## 📸 Demo

🌐 **Live Demo**:  
[https://algonive-task-management-for-small.vercel.app/](https://algonive-task-management-for-small.vercel.app/)

> Explore the full functionality of the project in the live deployed version.

---


