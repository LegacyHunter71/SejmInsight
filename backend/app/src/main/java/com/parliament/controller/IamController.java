package com.parliament.controller;

import com.parliament.api.IamFacade;
import com.parliament.api.UserCreateRequest;
import com.parliament.api.UserDto;
import com.parliament.api.UserProfileUpdate;
import com.parliament.enums.UserRole;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/iam")
@RequiredArgsConstructor
class IamController {

    private final IamFacade iamFacade;

    @Operation(
            summary = "Rejestracja",
            security = {}
    )
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@RequestBody @Valid UserCreateRequest request) {
        iamFacade.registerUser(request);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'CITIZEN')")
    public UserDto getCurrentUser() {
        return iamFacade.getRequiredCurrentUser();
    }

    @PatchMapping("/users/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'CITIZEN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateProfile(
            @PathVariable UUID userId,
            @RequestBody @Valid UserProfileUpdate request) {
        iamFacade.updateUserProfile(userId, request);
    }

    @PatchMapping("/users/{userId}/role")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void changeRole(
            @PathVariable UUID userId,
            @RequestParam UserRole newRole) {
        iamFacade.changeUserRole(userId, newRole);
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable UUID userId) {
        iamFacade.softDeleteUser(userId);
    }
}
