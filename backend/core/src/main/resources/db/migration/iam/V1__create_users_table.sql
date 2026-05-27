CREATE TABLE users (
                       id UUID PRIMARY KEY,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       first_name VARCHAR(255),
                       last_name VARCHAR(255),
                       deleted BOOLEAN NOT NULL DEFAULT FALSE,
                       deleted_at TIMESTAMP,
                       created_at TIMESTAMP NOT NULL
);