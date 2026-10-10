package com.figureverse.api.service;

import com.figureverse.api.model.User;
import com.figureverse.api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String nombre, String email, String password) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("El correo no es válido");
        }
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
        }

        String emailLimpio = email.trim().toLowerCase();
        if (userRepository.existsByEmail(emailLimpio)) {
            throw new IllegalArgumentException("Ya existe una cuenta con ese correo");
        }

        User user = new User();
        user.setNombre(nombre.trim());
        user.setEmail(emailLimpio);
        user.setPasswordHash(passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        if (email == null || password == null) {
            throw new IllegalArgumentException("Correo o contraseña incorrectos");
        }
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Correo o contraseña incorrectos"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Correo o contraseña incorrectos");
        }
        return user;
    }
}