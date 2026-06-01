package com.parliament.api;

import java.time.LocalDateTime;

public record AdminCommentDto(
        String id,
        String content,
        String authorId,
        String authorName,
        LocalDateTime createdAt,
        ModerationStatus moderationStatus,
        Integer deputyId,
        Integer voteTerm,
        Integer proceedingNo,
        Integer votingNo,
        String parentId
) {}
