use tripgenie;
CREATE TABLE providers1(
    provider_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    provider_name VARCHAR(150) NOT NULL,
    provider_type VARCHAR(50) NOT NULL,
    verification_status VARCHAR(30) DEFAULT 'PENDING',
    rating DECIMAL(2,1) DEFAULT 0.0,
    phone VARCHAR(20),
    location VARCHAR(255),
    qr_token VARCHAR(255) UNIQUE,

    CHECK (rating >= 0 AND rating <= 5)
);
select * from providers1;