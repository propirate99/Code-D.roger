use tripgenie;
CREATE TABLE analytics (
 analytics_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 metric_date DATE NOT NULL, destination_id BIGINT UNSIGNED, provider_id BIGINT UNSIGNED,
 metric_type ENUM('VISITORS','BOOKINGS','REVENUE','REVIEWS','COMPLAINTS','POPULARITY','CROWD_LEVEL') NOT NULL,
 metric_value DECIMAL(14,2) DEFAULT 0, notes TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (destination_id) REFERENCES destinations(destination_id) ON DELETE SET NULL,
 FOREIGN KEY (provider_id) REFERENCES providers1(provider_id) ON DELETE SET NULL,
 CHECK (metric_value >= 0)
) ENGINE=InnoDB;
select * from analytics;