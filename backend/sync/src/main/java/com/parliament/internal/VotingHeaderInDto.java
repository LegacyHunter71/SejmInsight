package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
record VotingHeaderDto(@JsonAlias({"votingNumber", "votingNo"}) Integer votingNumber) {
}