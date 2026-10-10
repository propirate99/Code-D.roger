use tripgenie;
CREATE TABLE destinations (
 destination_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(150) NOT NULL, description TEXT, city VARCHAR(100) NOT NULL,
 latitude DECIMAL(9,6), longitude DECIMAL(9,6), category VARCHAR(50) NOT NULL,
 entry_fee DECIMAL(10,2) DEFAULT 0, opening_time TIME, closing_time TIME,
 is_hidden_gem BOOLEAN DEFAULT FALSE, accessibility_score INT, active BOOLEAN DEFAULT TRUE,
 CHECK (entry_fee >= 0), CHECK (accessibility_score IS NULL OR accessibility_score BETWEEN 0 AND 100)
) ENGINE=InnoDB;
select * from destinations;