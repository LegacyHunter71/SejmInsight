package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
record VoteDto(
        @JsonAlias({"MPid", "mpid", "MP", "id"}) Integer MPid,
        @JsonAlias({"vote", "glos"}) String vote
) {
    public boolean isPresent() {
        return !"ABSENT".equals(vote);
    }
}