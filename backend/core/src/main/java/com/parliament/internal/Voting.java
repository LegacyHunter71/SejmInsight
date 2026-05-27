package com.parliament.internal;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "votings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class Voting {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private Integer voteTerm;

    @Column(nullable = false)
    private Integer proceedingNo;

    @Column(nullable = false)
    private Integer votingNo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String title;
}
