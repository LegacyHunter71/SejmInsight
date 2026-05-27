package com.parliament.deputy.api.dto;

public record DeputyListItemDto(
        Integer id,
        String firstName,
        String lastName,
        String club,
        String districtName,
        Boolean active,
        Double attendanceRate
) {}
