package com.parliament.internal;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "comment_likes")
@Getter
@NoArgsConstructor
@AllArgsConstructor
class CommentLike {

    @EmbeddedId
    private CommentLikeId id;
}
