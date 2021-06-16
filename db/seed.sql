USE employee_tracker; 

INSERT INTO Department (name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Legal');

INSERT INTO Role 
    (title, salary,department_id)
VALUES 
    ('Sales Director', 90000, 1),
    ('Account Executive', 140000, 1),

    ('Mechanical Engineer', 120000, 2),
    ('Software Engineer', 130000, 2),

    ('Accounts Receivable', 150000, 3),
    ('Procurement', 115000,3),

    ('General Counsel', 180000,4),
    ('Corporate Counsel', 165000, 4);

INSERT INTO Employee 
    (first_name,last_name,role_id, manager_id)
VALUES 
    ('Scott', 'Summers', 1, NULL),
    ('Jean', 'Grey', 2, 1),
    ('Hank', 'McCoy', 3, NULL),
    ('Bobby', 'Drake', 4, 3),
    ('Logan', 'X', 5, NULL),
    ('Charles', 'Xavier', 6, 5),
    ('Piotr', 'Nikolaievitch Rasputin', 7, NULL),
    ('Kitty', 'Pride', 8, 7);