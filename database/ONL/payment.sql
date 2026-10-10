use tripgenie;
USE tripgenie;

CREATE TABLE payments (
    payment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNSIGNED NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    payment_method ENUM('UPI', 'CARD', 'NET_BANKING', 'WALLET', 'CASH') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency CHAR(3) DEFAULT 'INR',
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')
        DEFAULT 'PENDING',
    paid_at TIMESTAMP NULL,

    FOREIGN KEY (booking_id)
        REFERENCES bookings1(booking_id)
        ON DELETE CASCADE,

    CHECK (amount >= 0)
) ENGINE=InnoDB;
select * from payments;