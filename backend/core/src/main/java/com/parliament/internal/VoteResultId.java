package com.parliament.internal;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
class VoteResultId implements Serializable {

    @Column(name = "voting_id")
    private UUID votingId;

    @Column(name = "deputy_id")
    private Integer deputyId;
}
