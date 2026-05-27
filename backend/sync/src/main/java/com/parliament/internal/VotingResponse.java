package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
record VotingResponse(
        Integer term,
        Integer proceedingNo,
        Integer votingNo,
        String title,
        String date,
        List<VoteDto> votes
) {}
