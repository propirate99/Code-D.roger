use tripgenie;
CREATE TABLE booking_drafts (
    draft_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    provider_id BIGINT UNSIGNED,

    service_id INT,

    trip_id INT UNSIGNED,

    booking_date DATE,

    quantity INT DEFAULT 1,

    estimated_amount DECIMAL(12,2),

    status ENUM(
        'DRAFT',
        'READY',
        'CONVERTED',
        'DISCARDED'
    ) DEFAULT 'DRAFT',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_draft_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_draft_provider
        FOREIGN KEY (provider_id)
        REFERENCES providers1(provider_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_draft_service
        FOREIGN KEY (service_id)
        REFERENCES services1(service_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_draft_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(trip_id)
        ON DELETE SET NULL,

    CHECK (quantity >= 1)
) ENGINE=InnoDB;
select * from booking_drafts;