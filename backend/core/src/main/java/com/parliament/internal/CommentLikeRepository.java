package com.parliament.internal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
interface CommentLikeRepository extends JpaRepository<CommentLike, CommentLikeId> {

    long countByIdCommentId(UUID commentId);

    @Query("SELECT cl.id.commentId AS commentId, COUNT(cl) AS likeCount " +
           "FROM CommentLike cl WHERE cl.id.commentId IN :ids GROUP BY cl.id.commentId")
    List<CommentLikeCount> countGroupedByCommentId(@Param("ids") Collection<UUID> ids);

    interface CommentLikeCount {
        UUID getCommentId();
        Long getLikeCount();
    }
}
