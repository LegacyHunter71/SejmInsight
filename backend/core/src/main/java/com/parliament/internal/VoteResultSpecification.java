package com.parliament.internal;

import com.parliament.enums.VoteKind;
import org.springframework.data.jpa.domain.Specification;

class VoteResultSpecification {

    static Specification<VoteResult> forDeputy(Integer deputyId) {
        return (root, query, cb) -> cb.equal(root.get("id").get("deputyId"), deputyId);
    }

    static Specification<VoteResult> hasVote(VoteKind vote) {
        return (root, query, cb) -> vote == null ? null : cb.equal(root.get("vote"), vote);
    }

    static Specification<VoteResult> titleContains(String title) {
        return (root, query, cb) -> title == null ? null :
                cb.like(cb.lower(root.join("voting").get("title")),
                        "%" + title.toLowerCase() + "%");
    }
}
