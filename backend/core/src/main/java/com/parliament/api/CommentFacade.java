package com.parliament.api;

import java.util.List;
import java.util.UUID;

public interface CommentFacade {

    void addComment(Integer deputyId, Integer term, Integer proceedingNo, Integer votingNo,
                    CommentCreateRequest request);

    void addReply(UUID parentId, CommentCreateRequest request);

    List<CommentDto> getComments(Integer deputyId, Integer term, Integer proceedingNo, Integer votingNo);

    LikeResult toggleLike(UUID commentId);

    void deleteComment(UUID commentId);

    List<AdminCommentDto> getPendingComments();

    void moderateComment(UUID commentId, ModerationStatus status);
}
