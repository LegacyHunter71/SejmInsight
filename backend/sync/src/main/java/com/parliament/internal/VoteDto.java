package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
record VoteDto(
        @JsonAlias({"MPid", "mpid", "id"}) Integer MPid,
        @JsonAlias({"vote"}) String vote
) {
    public boolean isPresent() {
        return !"ABSENT".equals(vote);
    }
}