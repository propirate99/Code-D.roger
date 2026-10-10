use tripgenie;
CREATE TABLE saved_bookings (
    saved_booking_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    booking_id BIGINT UNSIGNED NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (booking_id)
        REFERENCES bookings1(booking_id)
        ON DELETE CASCADE,

    UNIQUE (user_id, booking_id)
) ENGINE=InnoDB;
select * from saved_bookings;