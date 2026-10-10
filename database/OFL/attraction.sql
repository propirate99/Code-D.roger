use tripgenie;
 create TABLE attractions(
    attraction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    category VARCHAR(100),
    entry_fee DECIMAL(10,2) DEFAULT 0,
    opening_time TIME,
    closing_time TIME,
    is_hidden_gem BOOLEAN DEFAULT FALSE,
    accessibility_score INT DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from attractions;