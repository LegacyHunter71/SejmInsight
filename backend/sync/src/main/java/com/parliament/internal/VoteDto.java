package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
record VoteDto(
        @JsonProperty("MPid") Integer MPid,
        @JsonProperty("vote") String vote
) {
    public boolean isPresent() {
        return !"ABSENT".equals(vote);
    }
}