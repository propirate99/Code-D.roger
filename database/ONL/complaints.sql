use tripgenie;
CREATE TABLE complaints (
 complaint_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL, provider_id BIGINT UNSIGNED,
 booking_id BIGINT UNSIGNED, subject VARCHAR(200) NOT NULL, description TEXT NOT NULL,
 priority ENUM('LOW','MEDIUM','HIGH','URGENT') DEFAULT 'MEDIUM',
 status ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') DEFAULT 'OPEN',
 assigned_to BIGINT UNSIGNED, resolution TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, resolved_at TIMESTAMP NULL,
 FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
 FOREIGN KEY (provider_id) REFERENCES providers1(provider_id) ON DELETE SET NULL,
 FOREIGN KEY (booking_id) REFERENCES bookings1(booking_id) ON DELETE SET NULL,
 FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;
select * from complaints;