use tripgenie;
CREATE TABLE Offline_Alert (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    alert_message VARCHAR(255) NOT NULL,
    alert_time DATETIME NOT NULL,
    location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Pending',

    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
select * from Offline_Alert;