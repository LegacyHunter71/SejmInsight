package com.parliament.internal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VoteResultRepository extends JpaRepository<VoteResult, VoteResultId>,
        JpaSpecificationExecutor<VoteResult> {

    @EntityGraph(attributePaths = {"voting"})
    Page<VoteResult> findAll(Specification<VoteResult> spec, Pageable pageable);

    @Modifying
    @Query("DELETE FROM VoteResult vr WHERE vr.id.votingId = :votingId")
    void deleteByVotingId(@Param("votingId") UUID votingId);

    @Query("SELECT vr.id.deputyId AS deputyId, COUNT(vr) AS total, " +
           "SUM(CASE WHEN vr.present = TRUE THEN 1 ELSE 0 END) AS presentCount " +
           "FROM VoteResult vr GROUP BY vr.id.deputyId")
    List<DeputyAttendanceProjection> findAttendanceStats();

    interface DeputyAttendanceProjection {
        Integer getDeputyId();
        Long getTotal();
        Long getPresentCount();
    }
}
