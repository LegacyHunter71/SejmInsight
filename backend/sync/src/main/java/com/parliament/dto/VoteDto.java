package com.parliament.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record VoteDto(
        Integer MPid,
        String vote
) {
    public boolean isPresent() {
        return !"ABSENT".equals(vote);
    }
}
