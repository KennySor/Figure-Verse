package com.figureverse.api.dto;

import com.figureverse.api.model.User;

public record AuthResponse(Long id, String nombre, String email, String rol, String token) {

    public static AuthResponse from(User user, String token) {
        return new AuthResponse(user.getId(), user.getNombre(), user.getEmail(), user.getRol(), token);
    }
}
