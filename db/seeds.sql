use employees_db

INSERT INTO department
    (name)
VALUES
("Developer"),
("Sales"),
("Finance");

INSERT INTO role
    (title, salary, department_id)
VALUES
("Computer Science", 120000, 1),
("Accountant", 80000, 2);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
("John", "Webster", 1, 2),
("Luis", "Avila", 2, 3);