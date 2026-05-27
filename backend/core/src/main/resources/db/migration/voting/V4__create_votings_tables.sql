CREATE TABLE votings (
    id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    vote_term     INTEGER NOT NULL,
    proceeding_no INTEGER NOT NULL,
    voting_no     INTEGER NOT NULL,
    title         TEXT    NOT NULL,
    UNIQUE (vote_term, proceeding_no, voting_no)
);

CREATE TABLE vote_results (
    voting_id  UUID    NOT NULL REFERENCES votings(id),
    deputy_id  INTEGER NOT NULL REFERENCES deputies(id),
    vote       VARCHAR(20) NOT NULL,
    present    BOOLEAN NOT NULL,
    PRIMARY KEY (voting_id, deputy_id)
);
