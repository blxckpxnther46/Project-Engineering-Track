-- CORRECTED SCHEMA (POSTGRESQL)

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    user_id INT NOT NULL,
    project_id INT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (project_id) REFERENCES projects(project_id)
        ON DELETE CASCADE
);