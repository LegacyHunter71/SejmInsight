package com.parliament.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record VotingResponse(
        Integer term,
        Integer proceedingNo,
        Integer votingNo,
        String title,
        List<VoteDto> votes
) {}
