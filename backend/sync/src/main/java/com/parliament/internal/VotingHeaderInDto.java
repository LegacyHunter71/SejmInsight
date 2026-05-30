package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
record VotingHeaderInDto(@JsonAlias({"votingNumber", "votingNo", "voting", "number", "id"}) Integer votingNumber) {}