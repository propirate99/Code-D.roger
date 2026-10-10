use tripgenie;
CREATE TABLE chat_sessions (
    chat_session_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    trip_id INT UNSIGNED,

    session_title VARCHAR(200),

    language VARCHAR(50) DEFAULT 'English',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_chat_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_chat_trip
        FOREIGN KEY (trip_id)
        REFERENCES trips(trip_id)
        ON DELETE SET NULL,

    INDEX idx_chat_user (user_id),
    INDEX idx_chat_trip (trip_id)
) ENGINE=InnoDB;
select * from chat_sessions;