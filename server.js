// Imports my necessary packages
const express = require("express");
const inquirer = require("inquirer")
const db = require("./db/connection.js")
const PORT = process.env.PORT || 3001;
const app = express();
// Allows me to import env file to store my personal information safely
require("dotenv").config();


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
        } else if (answers.prompt === "Add an employee") {
            // Database will show all employees and roles
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        //Adding employee first name
                        type: "input",
                        name: "firstName",
                        message: "What is the employees first name?",
                        validate: firstNameInput => {
                            if (firstNameInput) {
                                return true;
                            } else {
                                console.log("Add a first name");
                                return false;
                            }
                        }
                    },
                    {
                        //Adding employees last name
                        type: "input",
                        name: "lastName",
                        message: "What is the employees last name?",
                        validate: lastNameInput => {
                            if (lastNameInput) {
                                return true;
                            } else {
                                console.log("Please add a last name");
                                return false;
                            }
                        }
                    },
                    {
                        //Adding employee role
                        type: "list",
                        name: "role",
                        message: "What is the employees role?",
                        choices: () => [...new Set(result.map(item => item.title))]
                    },
                    {
                        type: "input",
                        name: "manager",
                        message: "Who is the employees manager?",
                        validate: managerInput => {
                            if (managerInput) {
                                return true;
                            } else {
                                console.log("Please add a manager for the employee")
                                return false;
                            }
                        }
                    }
                ]).then((answers) => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.firstName} ${answers.lastName} to the database`)
                        startMenu();
                    });
                })
            });

        } else if (answers.prompt === "Update an employee role") {
            // Database will show all employees and roles
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        //Allow you to choose which existing employee you'd like to update
                        type: "list",
                        name: "employee",
                        message: "Which employee would you like to update?",
                        choices: () => [...new Set(result.map(item => item.last_name))]
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "What is their new role?",
                        choices: () => [...new Set(result.map(item => item.title))]
                    }
                ]).then((answers) => {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].last_name === answers.employee) {
                            var name = result[i];
                        }
                    }
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].title === answers.role) {
                            var role = result[i];
                        }
                    }
                    db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, result) => {
                        if (err) throw err;
                        console.log(`Updated ${answers.employee} role to the database`)
                        startMenu();
                    });
                })
            });
        } else if (answers.prompt === "Log out") {
            db.end();
            console.log("You have been signed out");
        }
    })
};














// Starting my local host
app.listen(PORT, () => {
    console.log(`Console running on port ${PORT}`);
});