package com.parliament.deputy.internal;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "deputies")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class Deputy {
    @Id
    private Integer id;
    private String firstName;
    private String lastName;
    private String club;
    private String districtName;
    private Boolean active;
    private LocalDateTime lastSync;

    private Integer totalVotings;
    private Integer presentVotings;
    private Double attendanceRate;
}
