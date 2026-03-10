package com.parliament.enums;

public enum VoteKind {
    YES(true),
    NO(true),
    ABSTAIN(true),
    NOT_VOTED(true),
    ABSENT(false);

    private final boolean present;

    VoteKind(boolean present) {
        this.present = present;
    }

    public boolean isPresent() {
        return this.present;
    }
}
