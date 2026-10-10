use tripgenie;
CREATE TABLE Emergency_Contact (
    emergency_contact_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50),
    phone_number VARCHAR(15) NOT NULL,
    alternate_phone VARCHAR(15),
    email VARCHAR(100),
    address VARCHAR(255),

    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
select * from Emergency_Contact;