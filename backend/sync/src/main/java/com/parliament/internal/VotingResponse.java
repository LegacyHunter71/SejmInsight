package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
record SejmVotingResponse(
        @JsonAlias({"term", "kadencja"}) Integer term,
        @JsonAlias({"sitting", "proceedingNo", "proceeding", "number"}) Integer sitting,
        @JsonAlias({"votingNumber", "votingNo", "voting"}) Integer votingNumber,
        @JsonAlias({"title", "topic"}) String title,
        @JsonAlias({"votes", "glosy"}) List<VoteDto> votes
) {}
