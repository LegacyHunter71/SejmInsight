package com.parliament.internal;

import com.parliament.api.ModerationStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
interface CommentRepository extends JpaRepository<Comment, UUID> {

    @EntityGraph(attributePaths = {"author", "deputy"})
    List<Comment> findByDeputyIdAndVoteTermAndProceedingNoAndVotingNoAndParentIdIsNullAndModerationStatus(
            Integer deputyId, Integer voteTerm, Integer proceedingNo, Integer votingNo,
            ModerationStatus moderationStatus);

    @EntityGraph(attributePaths = {"author"})
    List<Comment> findByParentIdInAndModerationStatus(Collection<UUID> parentIds, ModerationStatus moderationStatus);

    @EntityGraph(attributePaths = {"author"})
    List<Comment> findByModerationStatus(ModerationStatus moderationStatus);
}
