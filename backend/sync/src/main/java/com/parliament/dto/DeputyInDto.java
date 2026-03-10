package com.parliament.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DeputyInDto(
        @JsonProperty("id") Integer id,
        @JsonProperty("firstLastName") String firstLastName,
        @JsonProperty("club") String club,
        @JsonProperty("districtName") String districtName,
        @JsonProperty("active") Boolean active
) {
    public String getPhotoUrl() {
        return "https://api.sejm.gov.pl/sejm/term10/MP/" + id + "/photo";
    }
}
