CREATE TABLE deputies (
                          id INTEGER PRIMARY KEY,
                          first_name VARCHAR(255),
                          last_name VARCHAR(255),
                          club VARCHAR(255),
                          district_name VARCHAR(255),
                          active BOOLEAN,
                          last_sync TIMESTAMP,
                          total_votings INTEGER,
                          present_votings INTEGER,
                          attendance_rate DOUBLE PRECISION
);