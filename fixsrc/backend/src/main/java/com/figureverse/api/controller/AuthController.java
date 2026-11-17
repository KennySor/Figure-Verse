package com.figureverse.api.controller;

import com.figureverse.api.dto.AuthResponse;
import com.figureverse.api.dto.LoginRequest;
import com.figureverse.api.dto.RegisterRequest;
import com.figureverse.api.model.User;
import com.figureverse.api.security.TokenService;
import com.figureverse.api.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final TokenService tokenService;

    public AuthController(AuthService authService, TokenService tokenService) {
        this.authService = authService;
        this.tokenService = tokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = authService.register(request.nombre(), request.email(), request.password());
            String token = tokenService.generate(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(AuthResponse.from(user, token));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.login(request.email(), request.password());
            String token = tokenService.generate(user);
            return ResponseEntity.ok(AuthResponse.from(user, token));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("mensaje", e.getMessage()));
        }
    }
}