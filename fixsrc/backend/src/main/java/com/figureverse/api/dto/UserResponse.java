package com.figureverse.api.dto;

import com.figureverse.api.model.User;

public record UserResponse(Long id, String nombre, String email, String rol) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getNombre(), user.getEmail(), user.getRol());
    }
}