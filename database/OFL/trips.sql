use tripgenie;
CREATE TABLE trips (
    trip_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    trip_name VARCHAR(100) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(12,2),
    trip_status ENUM('PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED')
        DEFAULT 'PLANNED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CHECK (budget >= 0),
    CHECK (end_date >= start_date)
) ENGINE=InnoDB;
SELECT * from trips;