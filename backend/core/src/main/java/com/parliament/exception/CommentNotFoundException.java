package com.parliament.exception;

import java.util.UUID;

public class CommentNotFoundException extends DomainException {
    public CommentNotFoundException(UUID commentId) {
        super("Comment with ID " + commentId + " not found");
    }
}
