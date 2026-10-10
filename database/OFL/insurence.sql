use tripgenie;
CREATE TABLE insurance_plans (
    plan_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    plan_code VARCHAR(20) NOT NULL UNIQUE,
    plan_name VARCHAR(100) NOT NULL,
    tier ENUM('Basic', 'Silver', 'Gold', 'Platinum') DEFAULT 'Silver',
    description TEXT,
    base_price_per_day DECIMAL(8, 2) NOT NULL,
    max_coverage_limit DECIMAL(12, 2) NOT NULL,
    deductible DECIMAL(8, 2) DEFAULT 0.00,
    min_age INT DEFAULT 0,
    max_age INT DEFAULT 99,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_plan_code (plan_code)
) ENGINE=InnoDB;
select * from insurance_plans;