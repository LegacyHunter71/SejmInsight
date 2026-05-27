package com.parliament.security;

import com.parliament.enums.UserRole;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserContext {

    public static UUID getUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
            return UUID.fromString(jwt.getSubject());
        }
        throw new RuntimeException("No authenticated user found in context");
    }

    public static List<UserRole> getRoles() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth instanceof AnonymousAuthenticationToken) {
            return List.of();
        }

        return auth.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority().replace("ROLE_", ""))
                .map(UserRole::valueOf)
                .collect(Collectors.toList());
    }

    public static boolean hasRole(UserRole role) {
        return getRoles().contains(role);
    }

    public static boolean isAdmin() {
        return hasRole(UserRole.ADMIN);
    }

    public static boolean isAnalyst() {
        return hasRole(UserRole.ANALYST);
    }

    public static boolean isCitizen() {
        return hasRole(UserRole.CITIZEN);
    }

    public static boolean isAuthenticated() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken);
    }
}
