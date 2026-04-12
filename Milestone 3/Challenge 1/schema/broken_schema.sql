-- Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Projects Table
CREATE TABLE Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    owner_id INT,
    FOREIGN KEY (owner_id) REFERENCES Users(user_id)
        ON DELETE SET NULL
);

-- Tasks Table
CREATE TABLE Tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    task_name VARCHAR(100) NOT NULL,
    project_id INT NOT NULL,
    assigned_user_id INT,
    status VARCHAR(50) DEFAULT 'pending',

    FOREIGN KEY (project_id) REFERENCES Projects(project_id)
        ON DELETE CASCADE,

    FOREIGN KEY (assigned_user_id) REFERENCES Users(user_id)
        ON DELETE SET NULL
);

-- Many-to-Many Relationship (Users ↔ Projects)
CREATE TABLE UserProjects (
    user_id INT,
    project_id INT,

    PRIMARY KEY (user_id, project_id),

    FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (project_id) REFERENCES Projects(project_id)
        ON DELETE CASCADE
);