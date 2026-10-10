use tripgenie;
CREATE TABLE reviews (
 review_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL, provider_id BIGINT UNSIGNED,
 destination_id BIGINT UNSIGNED, booking_id BIGINT UNSIGNED,
 rating INT NOT NULL, comment TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
 FOREIGN KEY (provider_id) REFERENCES providers1(provider_id) ON DELETE SET NULL,
 FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE SET NULL,
 FOREIGN KEY (booking_id) REFERENCES bookings1(booking_id) ON DELETE SET NULL,
 CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;
select * from reviews;