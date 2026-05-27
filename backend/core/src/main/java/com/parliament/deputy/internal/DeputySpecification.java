package com.parliament.deputy.internal;

import org.springframework.data.jpa.domain.Specification;

class DeputySpecification {

    static Specification<Deputy> nameContains(String name) {
        return (root, query, cb) -> name == null ? null :
                cb.like(
                        cb.lower(cb.concat(cb.concat(root.get("firstName"), " "), root.get("lastName"))),
                        "%" + name.toLowerCase() + "%");
    }

    static Specification<Deputy> clubContains(String club) {
        return (root, query, cb) -> club == null ? null :
                cb.like(cb.lower(root.get("club")), "%" + club.toLowerCase() + "%");
    }

    static Specification<Deputy> districtContains(String district) {
        return (root, query, cb) -> district == null ? null :
                cb.like(cb.lower(root.get("districtName")), "%" + district.toLowerCase() + "%");
    }

    static Specification<Deputy> isActive(Boolean active) {
        return (root, query, cb) -> active == null ? null :
                cb.equal(root.get("active"), active);
    }
}
