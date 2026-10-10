use tripgenie;
CREATE TABLE services1(
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id BIGINT  UNSIGNED NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    capacity INT NOT NULL,
    cancellation_policy TEXT,

    FOREIGN KEY (provider_id)
        REFERENCES providers(provider_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CHECK (base_price >= 0),
    CHECK (capacity > 0)
);
select * from services1;