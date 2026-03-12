package com.parliament.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserCreateRequest(
        @NotBlank @Email String email,
        @JsonProperty("firstName") @NotBlank String firstName,
        @JsonProperty("lastName") @NotBlank String lastName
) {}