package com.parliament.controller;

import com.parliament.api.CommentCreateRequest;
import com.parliament.api.CommentDto;
import com.parliament.api.CommentFacade;
import com.parliament.api.LikeResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
class CommentController {

    private final CommentFacade commentFacade;

    @PostMapping("/deputies/{deputyId}/votings/{term}/{proceedingNo}/{votingNo}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'CITIZEN')")
    public void addComment(@PathVariable Integer deputyId,
                           @PathVariable Integer term,
                           @PathVariable Integer proceedingNo,
                           @PathVariable Integer votingNo,
                           @RequestBody @Valid CommentCreateRequest request) {
        commentFacade.addComment(deputyId, term, proceedingNo, votingNo, request);
    }

    @GetMapping("/deputies/{deputyId}/votings/{term}/{proceedingNo}/{votingNo}/comments")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'CITIZEN')")
    public List<CommentDto> getComments(@PathVariable Integer deputyId,
                                        @PathVariable Integer term,
                                        @PathVariable Integer proceedingNo,
                                        @PathVariable Integer votingNo) {
        return commentFacade.getComments(deputyId, term, proceedingNo, votingNo);
    }

    @PostMapping("/comments/{commentId}/replies")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'CITIZEN')")
    public void addReply(@PathVariable UUID commentId,
                         @RequestBody @Valid CommentCreateRequest request) {
        commentFacade.addReply(commentId, request);
    }

    @PostMapping("/comments/{commentId}/likes")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'CITIZEN')")
    public LikeResult toggleLike(@PathVariable UUID commentId) {
        return commentFacade.toggleLike(commentId);
    }

    @DeleteMapping("/comments/{commentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'CITIZEN')")
    public void deleteComment(@PathVariable UUID commentId) {
        commentFacade.deleteComment(commentId);
    }
}
