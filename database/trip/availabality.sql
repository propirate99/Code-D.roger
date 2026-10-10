use tripgenie;
CREATE TABLE availability_slots (
    slot_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    service_id BIGINT UNSIGNED NOT NULL,
    date DATE NOT NULL,
    available_units INT NOT NULL DEFAULT 0,
    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT UNSIGNED DEFAULT 1,

    FOREIGN KEY (service_id)
        REFERENCES services(service_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE (service_id, date),

    CHECK (available_units >= 0)
);
select * from availability_slots;