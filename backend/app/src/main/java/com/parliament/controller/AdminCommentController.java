package com.parliament.controller;

import com.parliament.api.AdminCommentDto;
import com.parliament.api.CommentFacade;
import com.parliament.api.ModerationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/comments")
@RequiredArgsConstructor
class AdminCommentController {

    private final CommentFacade commentFacade;

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminCommentDto> getPendingComments() {
        return commentFacade.getPendingComments();
    }

    @PostMapping("/{commentId}/approve")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void approveComment(@PathVariable UUID commentId) {
        commentFacade.moderateComment(commentId, ModerationStatus.APPROVED);
    }

    @PostMapping("/{commentId}/reject")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void rejectComment(@PathVariable UUID commentId) {
        commentFacade.moderateComment(commentId, ModerationStatus.REJECTED);
    }
}
