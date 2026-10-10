use tripgenie;
CREATE TABLE bookings1(
    booking_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    service_id INT  NOT NULL,
    travel_date DATE NOT NULL,
    travellers_count INT NOT NULL DEFAULT 1,
    quoted_price DECIMAL(10,2) NOT NULL,
    final_price DECIMAL(10,2),
    booking_status VARCHAR(30) DEFAULT 'PENDING',
    confirmation_code VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (service_id)
        REFERENCES services1(service_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CHECK (travellers_count > 0),
    CHECK (quoted_price >= 0),
    CHECK (final_price IS NULL OR final_price >= 0)
);
select * from bookings1;