// Imports my necessary packages
const express = require("express");
const mysql = require("mysql2");
const PORT = process.env.PORT || 3001;
const app = express();
// Allows me to import env file to store my personal information safely
require("dotenv").config();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: "localhost",
        // Can import my user, password, and database safely without having to type them out publicly
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log("Connected to the database")
)














// Starting my local host
app.listen(PORT, () => {
    console.log(`Console running on port ${PORT}`);
});