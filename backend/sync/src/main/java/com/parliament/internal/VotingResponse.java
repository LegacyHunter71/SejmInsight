package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
record VotingResponse(
        @JsonAlias({"term"}) Integer term,
        @JsonAlias({"sitting", "proceedingNo"}) Integer sitting,
        @JsonAlias({"votingNumber", "votingNo"}) Integer votingNumber,
        @JsonAlias({"title"}) String title,
        @JsonAlias({"votes"}) List<VoteDto> votes
) {
}
