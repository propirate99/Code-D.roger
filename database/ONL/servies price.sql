use tripgenie;
CREATE TABLE service_pricing (
 pricing_id INT AUTO_INCREMENT PRIMARY KEY,
 service_id INT NOT NULL,
 pricing_type ENUM('PER_PERSON','PER_ROOM','PER_DAY','PER_HOUR','PER_TRIP','FIXED') DEFAULT 'FIXED',
 price DECIMAL(12,2) NOT NULL, currency CHAR(3) DEFAULT 'INR',
 valid_from DATE, valid_to DATE,
 FOREIGN KEY (service_id) REFERENCES services1(service_id) ON DELETE CASCADE,
 CHECK (price >= 0)
) ENGINE=InnoDB;
select * from service_pricing;