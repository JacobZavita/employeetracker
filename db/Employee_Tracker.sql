DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker; 

CREATE TABLE Department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR (30)NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30)NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES Department(id)
);

CREATE TABLE Employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR (30)NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES Role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);