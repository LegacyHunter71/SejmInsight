package com.parliament.api;

import com.parliament.enums.UserRole;

import java.util.UUID;

public interface IamFacade {

    void registerUser(UserCreateRequest request);

    void updateUserProfile(UUID userId, UserProfileUpdate request);

    void changeUserRole(UUID userId, UserRole newRole);

    void softDeleteUser(UUID userId);

    UserDto getRequiredCurrentUser();
}
