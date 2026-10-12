-- TaskFlow schema (MySQL 8.x, InnoDB, utf8mb4)
CREATE DATABASE IF NOT EXISTS taskflow
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taskflow;

CREATE TABLE IF NOT EXISTS tasks (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title       VARCHAR(150) NOT NULL,
  description TEXT NULL,
  status      ENUM('To Do','In Progress','Done') NOT NULL DEFAULT 'To Do',
  priority    ENUM('Low','Medium','High','Urgent') NOT NULL DEFAULT 'Medium',
  due_date    DATE NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_tasks_status (status),
  INDEX idx_tasks_priority (priority),
  INDEX idx_tasks_due_date (due_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS labels (
  id    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(50) NOT NULL,
  color VARCHAR(7) NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS task_labels (
  task_id  INT UNSIGNED NOT NULL,
  label_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (task_id, label_id),
  FOREIGN KEY (task_id)  REFERENCES tasks(id)  ON DELETE CASCADE,
  FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS activities (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  task_id     INT UNSIGNED NULL,
  event_type  VARCHAR(40) NOT NULL,
  description VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
) ENGINE=InnoDB;
