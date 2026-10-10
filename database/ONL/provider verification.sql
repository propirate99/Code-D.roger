use tripgenie;
CREATE TABLE provider_verifications (
 verification_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 provider_id BIGINT UNSIGNED NOT NULL, document_type VARCHAR(100) NOT NULL,
 document_number VARCHAR(100), document_reference VARCHAR(255),
 verification_status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
 verified_by BIGINT UNSIGNED, submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 verified_at TIMESTAMP NULL,
 FOREIGN KEY (provider_id) REFERENCES providers1(provider_id) ON DELETE CASCADE,
 FOREIGN KEY (verified_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;
select * from provider_verifications;