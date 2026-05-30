package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
record VotingHeaderInDto(
        @JsonProperty("proceedingNo") Integer proceedingNo,
        @JsonProperty("votingNo") Integer votingNo,
        String title,
        String date
) {}
