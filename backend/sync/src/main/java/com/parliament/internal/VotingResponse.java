package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
record VotingResponse(
        @JsonProperty("term") Integer term,
        @JsonProperty("proceedingNo") Integer proceedingNo,
        @JsonProperty("votingNo") Integer votingNo,
        @JsonProperty("title") String title,
        @JsonProperty("votes") List<VoteDto> votes
) {}
