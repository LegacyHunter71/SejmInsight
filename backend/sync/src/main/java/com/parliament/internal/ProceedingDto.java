package com.parliament.internal;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
record ProceedingDto(@JsonAlias({"sitting", "proceedingNo", "proceeding", "number", "id"}) Integer sitting) {
}
