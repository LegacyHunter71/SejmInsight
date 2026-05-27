package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
record VoteDto(
        Integer MPid,
        String vote
) {
    public boolean isPresent() {
        return !"ABSENT".equals(vote);
    }
}
