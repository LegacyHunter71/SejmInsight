package com.parliament.internal;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
interface CommentRepository extends JpaRepository<Comment, UUID> {

    @EntityGraph(attributePaths = {"author", "deputy"})
    List<Comment> findByDeputyIdAndVoteTermAndProceedingNoAndVotingNoAndParentIdIsNull(
            Integer deputyId, Integer voteTerm, Integer proceedingNo, Integer votingNo);

    @EntityGraph(attributePaths = {"author"})
    List<Comment> findByParentIdIn(Collection<UUID> parentIds);
}
