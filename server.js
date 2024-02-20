// Imports my necessary packages
const express = require("express");
const inquirer = require("inquirer")
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

const startMenu = () => {
    inquirer.prompt([
        //Begins command line by asking questions with inquirer
        {
        type: "list",
        name: "prompt",
        message: "what would you like to do?",
        choices: ["View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Log out"]
        },
    ])
    .then((answers) => {
        if (answers.prompt === "View all employees") {
            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) throw err;
                console.log("Viewing all employees: ");
                console.table(result);
                startMenu();
            });
        }
        else if (answers.prompt === "Add a department") {
            inquirer.prompt([{
                //Adding a department
                type: "input", 
                name: "department",
                message: "What is the name of the department?",
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log("Add a department");
                        return false;
                    }
                }
            }]).then((answers) => {
                db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.department} to the database`)
                    startMenu();
                });
            })
        } else if (answers.prompt === "Add a role") {
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        //Adding role
                        type: "input",
                        name: "role",
                        message: "What is the name of the role?",
                        validate: roleInput => {
                            if (roleInput) {
                                return true;
                            } else {
                                console.log("Please add a role");
                                return false;
                            }
                        }
                    },
                    {
                        //Adding the salary for the role
                        type: "input",
                        name: "salary",
                        message: "what is the salary of the role?",
                        validate: salaryInput => {
                            if (salaryInput) {
                                return true;
                            } else {
                                console.log("Pkease add a salary for the new role");
                                return false;
                            }
                        }
                    },
                    {
                        //Adding the department for the role
                        type: "list",
                        name: "department",
                        message: "Which department does the role belong to?",
                        choices: () => result.map(item => item.name)
                    }
                ]).then((answers) => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].name === answers.department) {
                            var department = result[i];
                        }
                    }
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.role} to the database`)
                        startMenu();
                    });
                })
            });
        } else if
    })
}














// Starting my local host
app.listen(PORT, () => {
    console.log(`Console running on port ${PORT}`);
});