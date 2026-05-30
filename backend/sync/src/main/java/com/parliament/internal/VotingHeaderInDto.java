package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
record VotingHeaderInDto(
        @JsonProperty("votingNo") Integer votingNo,
        @JsonProperty("title") String title,
        @JsonProperty("date") String date
) {}
