package com.parliament.internal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
interface VotingRepository extends JpaRepository<Voting, UUID> {

    Optional<Voting> findByVoteTermAndProceedingNoAndVotingNo(
            Integer voteTerm, Integer proceedingNo, Integer votingNo);
}
