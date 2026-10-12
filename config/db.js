const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'uni_club',
    port: process.env.DB_PORT || 3306,
    ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false,
});



const setupDatabase = () => {
db.query(`
    CREATE TABLE IF NOT EXISTS courses (
    id int(11) NOT NULL AUTO_INCREMENT,
    title varchar(100) NOT NULL,
    academy_years varchar(255) DEFAULT NULL,
    language varchar(50) NOT NULL,
    file_path varchar(255) NOT NULL,
    PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`, (err) => { if (err) console.log("Courses error:", err); });

db.query(`
    CREATE TABLE IF NOT EXISTS users (
    id int(11) NOT NULL AUTO_INCREMENT,
    userName varchar(100) NOT NULL,
    password varchar(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    userRole varchar(255) NOT NULL DEFAULT 'user',
    PRIMARY KEY (id),
    UNIQUE KEY userName (userName)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`, (err) => {
    if (!err) {
    const adminPass = "$2b$10$ezrG0t/jhC7pQzzVkSne..ngEaRT.6S3OfCAkdjmxSHHXaTcNGN9q";
    db.query(`INSERT IGNORE INTO users (id, userName, password, userRole) VALUES (1, 'issa', ?, 'admin')`, [adminPass], (e) => {
        if (!e) console.log("Admin 'issa' checked/created successfully!");
    });
    }
});

db.query(`
    CREATE TABLE IF NOT EXISTS materials (
    id int(11) NOT NULL AUTO_INCREMENT,
    title varchar(150) NOT NULL,
    file_path varchar(255) NOT NULL,
    course_id varchar(255) NOT NULL,
    user_id int(11) NOT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    academy_years int(11) NOT NULL,
    language varchar(255) NOT NULL,
    PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`, (err) => { if (err) console.log("Materials error:", err); });
};

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to Aiven MySQL!");
  setupDatabase();
});



const promisePool = pool.promise();

module.exports = promisePool;
