package com.parliament.api;

import java.time.LocalDateTime;
import java.util.List;

public record CommentDto(
        String id,
        String content,
        String authorId,
        String authorName,
        long likeCount,
        List<CommentDto> replies,
        LocalDateTime createdAt,
        boolean deleted
) {}
