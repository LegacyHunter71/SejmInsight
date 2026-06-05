package com.parliament.internal;

import com.parliament.api.IamFacade;
import com.parliament.api.UserCreateRequest;
import com.parliament.api.UserDto;
import com.parliament.api.UserProfileUpdate;
import com.parliament.enums.UserRole;
import com.parliament.exception.IamAuthenticationException;
import com.parliament.exception.UserNotFoundException;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
class IamFacadeImpl implements IamFacade {

    private final Keycloak keycloak;
    private final UserRepository userRepository;

    @Value("${parliament.iam.keycloak.realm}")
    private String realm;

    @Override
    @Transactional
    public void registerUser(UserCreateRequest request) {
        UserRepresentation kcUser = new UserRepresentation();
        kcUser.setUsername(request.email());
        kcUser.setEmail(request.email());
        kcUser.setFirstName(request.firstName());
        kcUser.setLastName(request.lastName());
        kcUser.setEnabled(true);
        
        kcUser.setEmailVerified(false);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue("Temporary123!");
        credential.setTemporary(true);

        kcUser.setCredentials(List.of(credential));

        Response response = keycloak.realm(realm).users().create(kcUser);
        if (response.getStatus() != 201) {
            log.error("Failed to create user in Keycloak: {}", response.getStatus());
            throw new RuntimeException("Registration service unavailable");
        }

        String kcId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");

        assignRoleInKeycloak(kcId, UserRole.CITIZEN);

        UserEntity localUser = UserEntity.builder()
                .id(UUID.fromString(kcId))
                .email(request.email())
                .firstName(request.firstName())
                .lastName(request.lastName())
                .build();

        userRepository.save(localUser);

        keycloak.realm(realm).users().get(kcId).sendVerifyEmail();

        log.info("User registered, synced and verification email sent: {}", kcId);
    }

    @Override
    public UserDto getRequiredCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            throw new IamAuthenticationException("No active session found");
        }

        if (auth.getPrincipal() instanceof Jwt jwt) {
            UUID userId = UUID.fromString(jwt.getSubject());
            UserEntity localUser = userRepository.findById(userId)
                    .orElseThrow(() -> new IamAuthenticationException("User authenticated but not found in local database. Sync error?"));

            List<String> cleanRoles = auth.getAuthorities().stream()
                    .map(a -> a.getAuthority().replace("ROLE_", ""))
                    .filter(roleName -> Arrays.stream(UserRole.values())
                            .anyMatch(enumRole -> enumRole.name().equals(roleName)))
                    .toList();

            return new UserDto(
                    localUser.getId().toString(),
                    jwt.getClaimAsString("preferred_username"),
                    localUser.getEmail(),
                    cleanRoles
            );
        }

        throw new IamAuthenticationException("Identity provider error: Invalid token");
    }

    @Override
    @Transactional
    @PreAuthorize("#userId.toString() == authentication.name or hasRole('ADMIN')")
    public void updateUserProfile(UUID userId, UserProfileUpdate request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        userRepository.save(user);

        UserRepresentation kcUser = keycloak.realm(realm).users().get(userId.toString()).toRepresentation();
        kcUser.setFirstName(request.firstName());
        kcUser.setLastName(request.lastName());
        keycloak.realm(realm).users().get(userId.toString()).update(kcUser);
    }

    @Override
    @Transactional
    public void changeUserRole(UUID userId, UserRole newRole) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(userId);
        }

        var userResource = keycloak.realm(realm).users().get(userId.toString());

        var currentRoles = userResource.roles().realmLevel().listAll().stream()
                .filter(r -> List.of("CITIZEN", "ANALYST", "ADMIN").contains(r.getName()))
                .toList();
        userResource.roles().realmLevel().remove(currentRoles);

        assignRoleInKeycloak(userId.toString(), newRole);
        log.info("Role changed to {} for user {}", newRole, userId);
    }



    @Override
    @Transactional
    public void softDeleteUser(UUID userId) {
        userRepository.deleteById(userId);

        UserRepresentation kcUser = keycloak.realm(realm).users().get(userId.toString()).toRepresentation();
        kcUser.setEnabled(false);
        keycloak.realm(realm).users().get(userId.toString()).update(kcUser);

        log.info("Soft delete completed for user: {}", userId);
    }

    private void assignRoleInKeycloak(String userId, UserRole role) {
        var roleRep = keycloak.realm(realm).roles().get(role.name()).toRepresentation();
        keycloak.realm(realm).users().get(userId).roles().realmLevel().add(List.of(roleRep));
    }
}
