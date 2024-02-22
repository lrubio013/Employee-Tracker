const mysql = require("mysql2");

const db = mysql.createConnection(
    {
        host: "localhost",
        // Can import my user, password, and database safely without having to type them out publicly
        user: "root",
        password: "password",
        database: "employees_db",
    },
    console.log("Connected to the database")
);

module.exports = db;