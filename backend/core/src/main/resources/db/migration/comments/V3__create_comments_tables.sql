CREATE TABLE comments (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deputy_id     INTEGER      NOT NULL REFERENCES deputies(id),
    vote_term     INTEGER      NOT NULL,
    proceeding_no INTEGER      NOT NULL,
    voting_no     INTEGER      NOT NULL,
    content       TEXT         NOT NULL,
    author_id     UUID         NOT NULL REFERENCES users(id),
    parent_id     UUID         REFERENCES comments(id),
    deleted_at    TIMESTAMP,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE comment_likes (
    comment_id UUID NOT NULL REFERENCES comments(id),
    user_id    UUID NOT NULL REFERENCES users(id),
    PRIMARY KEY (comment_id, user_id)
);
