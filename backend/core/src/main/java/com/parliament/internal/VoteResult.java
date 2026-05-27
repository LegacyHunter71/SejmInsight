package com.parliament.internal;

import com.parliament.enums.VoteKind;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vote_results")
@Getter
@Setter
@NoArgsConstructor
class VoteResult {

    @EmbeddedId
    private VoteResultId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voting_id", insertable = false, updatable = false)
    private Voting voting;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VoteKind vote;

    @Column(nullable = false)
    private boolean present;

    VoteResult(VoteResultId id, VoteKind vote, boolean present) {
        this.id = id;
        this.vote = vote;
        this.present = present;
    }
}
