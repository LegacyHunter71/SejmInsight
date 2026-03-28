package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
record VotingHeaderInDto(
        Integer proceedingNo,
        Integer votingNo,
        String title,
        String date
) {}
