use tripgenie;
CREATE TABLE booking_actions (
    action_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNSIGNED NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    user_confirmed BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_id VARCHAR(255),

    FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
select * from booking_actions;