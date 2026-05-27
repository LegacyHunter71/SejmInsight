package com.parliament.api;

import com.parliament.enums.VoteKind;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VotingFacade {

    void saveVoting(VotingSyncRequest request);

    Page<VotingDto> getDeputyVotings(Integer deputyId, VoteKind vote, String title, Pageable pageable);
}
