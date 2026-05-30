package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
record VotingResponse(
        Integer term,
        @JsonProperty("proceedingNo") Integer proceedingNo,
        @JsonProperty("votingNo") Integer votingNo,
        String title,
        String date,
        List<VoteDto> votes
) {}
