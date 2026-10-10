use tripgenie;
CREATE TABLE itineraries (
    itinerary_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    trip_id INT UNSIGNED NOT NULL,

    attraction_id BIGINT,

    day_number INT NOT NULL,
    activity_order INT NOT NULL,

    start_time TIME,
    end_time TIME,

    activity_type VARCHAR(80),

    reason TEXT,

    status ENUM(
        'PLANNED',
        'COMPLETED',
        'REPLACED',
        'SKIPPED'
    ) DEFAULT 'PLANNED',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_itinerary_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(trip_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_itinerary_attraction
        FOREIGN KEY (attraction_id)
        REFERENCES attractions(attraction_id)
        ON DELETE SET NULL,

    UNIQUE (
        trip_id,
        day_number,
        activity_order
    ),

    INDEX idx_itinerary_trip (trip_id)
) ENGINE=InnoDB;
select * from itineraries;