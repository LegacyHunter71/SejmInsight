package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
record ProceedingDto(
        @JsonProperty("proceedingNo") Integer proceedingNo,
        @JsonProperty("dates") List<String> dates,
        @JsonProperty("votings") List<VotingHeaderInDto> votings
) {}
