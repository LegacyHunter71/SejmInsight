package com.parliament.deputy.api.dto;

public record DeputySyncRequest(
        Integer id,
        String firstLastName,
        String club,
        String districtName,
        Boolean active
) {}
