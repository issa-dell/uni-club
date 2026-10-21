# 🎓 Uni-Club

**Uni-Club** is a web-based academic community platform designed for university students to share, organize, and access study materials, notes, and resources categorized by academic years.

---

## 🌐 Live Demo

Explore the live application deployed on Render:
👉 **[Uni-Club Live Application](https://uni-club-8f13.onrender.com/uni-club)**

---

## ✨ Key Features

* **Authentication & Authorization:** Secure user authentication with session management (`express-session`) and route protection via custom middlewares.
* **Academic Resource Management:** Upload, browse, and download study notes and course materials (PDFs).
* **Hybrid Storage Architecture:** Temporary file handling via `Multer` combined with automated upload to `Supabase Cloud Storage` and local buffer cleanup.
* **Structured Filtering:** Categorization and filtering of resources by subjects and academic years for effortless navigation.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Frontend:** EJS (Embedded JavaScript), HTML5, CSS3
* **Database:** SQL / TiDB
* **Cloud Storage:** Supabase Storage
* **File Uploads:** Multer
* **Hosting:** Render

---

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/issa-dell/uni-club.git
   cd uni-club
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (`.env`):**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   PORT=3000
   DB_HOST=my_db_host
   DB_USER=my_db_user
   DB_PASSWORD=my_db_password
   DB_NAME=my_db_name
   SUPABASE_URL=my_supabase_url
   SUPABASE_KEY=my_supabase_key
   SESSION_SECRET=my_session_secret
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   Open your browser and navigate to: `http://localhost:3000`

---

## 📝 License

This project is open-source and available for student use and educational purposes.
