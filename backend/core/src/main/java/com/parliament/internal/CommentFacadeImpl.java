package com.parliament.internal;

import com.parliament.api.CommentCreateRequest;
import com.parliament.api.CommentDto;
import com.parliament.api.CommentFacade;
import com.parliament.api.LikeResult;
import com.parliament.exception.CommentNotFoundException;
import com.parliament.exception.IamAuthenticationException;
import com.parliament.security.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
class CommentFacadeImpl implements CommentFacade {

    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void addComment(Integer deputyId, Integer term, Integer proceedingNo, Integer votingNo,
                           CommentCreateRequest request) {
        Comment comment = Comment.builder()
                .deputyId(deputyId)
                .voteTerm(term)
                .proceedingNo(proceedingNo)
                .votingNo(votingNo)
                .content(request.content())
                .authorId(UserContext.getUserId())
                .build();
        commentRepository.save(comment);
    }

    @Override
    @Transactional
    public void addReply(UUID parentId, CommentCreateRequest request) {
        Comment parent = commentRepository.findById(parentId)
                .orElseThrow(() -> new CommentNotFoundException(parentId));

        if (parent.getParentId() != null) {
            throw new IllegalStateException("Cannot reply to a reply");
        }

        Comment reply = Comment.builder()
                .deputyId(parent.getDeputyId())
                .voteTerm(parent.getVoteTerm())
                .proceedingNo(parent.getProceedingNo())
                .votingNo(parent.getVotingNo())
                .content(request.content())
                .authorId(UserContext.getUserId())
                .parentId(parentId)
                .build();
        commentRepository.save(reply);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDto> getComments(Integer deputyId, Integer term, Integer proceedingNo, Integer votingNo) {
        List<Comment> topLevel = commentRepository
                .findByDeputyIdAndVoteTermAndProceedingNoAndVotingNoAndParentIdIsNull(
                        deputyId, term, proceedingNo, votingNo);

        if (topLevel.isEmpty()) {
            return List.of();
        }

        List<UUID> topLevelIds = topLevel.stream().map(Comment::getId).toList();
        List<Comment> replies = commentRepository.findByParentIdIn(topLevelIds);

        Set<UUID> allAuthorIds = Stream.concat(topLevel.stream(), replies.stream())
                .map(Comment::getAuthorId)
                .collect(Collectors.toSet());
        Map<UUID, UserEntity> authors = userRepository.findAllById(allAuthorIds).stream()
                .collect(Collectors.toMap(UserEntity::getId, u -> u));

        Set<UUID> allIds = Stream.concat(topLevel.stream(), replies.stream())
                .map(Comment::getId)
                .collect(Collectors.toSet());
        Map<UUID, Long> likeCounts = commentLikeRepository.countGroupedByCommentId(allIds).stream()
                .collect(Collectors.toMap(
                        CommentLikeRepository.CommentLikeCount::getCommentId,
                        CommentLikeRepository.CommentLikeCount::getLikeCount));

        Map<UUID, List<Comment>> repliesByParent = replies.stream()
                .collect(Collectors.groupingBy(Comment::getParentId));

        return topLevel.stream()
                .map(c -> toDto(c, repliesByParent.getOrDefault(c.getId(), List.of()), authors, likeCounts))
                .toList();
    }

    @Override
    @Transactional
    public LikeResult toggleLike(UUID commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new CommentNotFoundException(commentId);
        }
        CommentLikeId likeId = new CommentLikeId(commentId, UserContext.getUserId());
        boolean nowLiked;
        if (commentLikeRepository.existsById(likeId)) {
            commentLikeRepository.deleteById(likeId);
            nowLiked = false;
        } else {
            commentLikeRepository.save(new CommentLike(likeId));
            nowLiked = true;
        }
        long count = commentLikeRepository.countByIdCommentId(commentId);
        return new LikeResult(count, nowLiked);
    }

    @Override
    @Transactional
    public void deleteComment(UUID commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        UUID currentUserId = UserContext.getUserId();
        if (!UserContext.isAdmin() && !comment.getAuthorId().equals(currentUserId)) {
            throw new IamAuthenticationException("Not authorized to delete this comment");
        }

        comment.setDeletedAt(LocalDateTime.now());
        commentRepository.save(comment);
    }

    private CommentDto toDto(Comment c, List<Comment> replies,
                             Map<UUID, UserEntity> authors, Map<UUID, Long> likeCounts) {
        boolean isDeleted = c.getDeletedAt() != null;
        UserEntity author = authors.get(c.getAuthorId());
        String authorName = (isDeleted || author == null)
                ? null
                : author.getFirstName() + " " + author.getLastName();

        List<CommentDto> replyDtos = replies.stream()
                .map(r -> toDto(r, List.of(), authors, likeCounts))
                .toList();

        return new CommentDto(
                c.getId().toString(),
                isDeleted ? null : c.getContent(),
                c.getAuthorId().toString(),
                authorName,
                likeCounts.getOrDefault(c.getId(), 0L),
                replyDtos,
                c.getCreatedAt(),
                isDeleted
        );
    }
}
