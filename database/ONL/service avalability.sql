use tripgenie;
CREATE TABLE service_availability (
 availability_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 service_id INT NOT NULL, available_date DATE NOT NULL,
 start_time TIME, end_time TIME, available_slots INT DEFAULT 1,
 status ENUM('AVAILABLE','FULL','BLOCKED') DEFAULT 'AVAILABLE',
 UNIQUE KEY uq_availability(service_id,available_date,start_time),
 FOREIGN KEY (service_id) REFERENCES services1(service_id) ON DELETE CASCADE,
 CHECK (available_slots >= 0)
) ENGINE=InnoDB;
select * from service_availability;