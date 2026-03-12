package com.parliament.enums;

public enum UserRole {
    CITIZEN,
    ANALYST,
    ADMIN;

    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}
