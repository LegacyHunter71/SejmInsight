package com.parliament.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record UserProfileUpdate(
        @JsonProperty("firstName") @NotBlank String firstName,
        @JsonProperty("lastName") @NotBlank String lastName
) {}
