USE employee_tracker;

INSERT INTO department (name)
VALUES
    ('design'),
    ('development'),
    ('marketing');

 INSERT INTO role (title, salary, department_id)
 VALUES
    ('editor', 50000, 3),
    ('front-end', 50000, 2),
    ('writer', 50000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('greg', 'metcalf', 3, null),
    ('damian', 'rivas', 2, null),
    ('nathaly', 'calderon', 2, null);
