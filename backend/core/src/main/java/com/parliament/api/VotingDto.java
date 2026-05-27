package com.parliament.api;

import com.parliament.enums.VoteKind;

public record VotingDto(
        String votingId,
        Integer voteTerm,
        Integer proceedingNo,
        Integer votingNo,
        String title,
        VoteKind vote,
        boolean present
) {}
