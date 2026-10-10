use tripgenie;
CREATE TABLE sync_queue (
    queue_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT UNSIGNED NOT NULL,
    action VARCHAR(30) NOT NULL,
    payload_json JSON,
    retry_count INT DEFAULT 0,
    sync_status VARCHAR(30) DEFAULT 'PENDING',

    CHECK (retry_count >= 0)
);
select * from sync_queue;