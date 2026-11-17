package com.figureverse.api.security;

import com.figureverse.api.model.User;
import com.figureverse.api.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    public static final String ATTR_USER_ID = "adminUserId";
    public static final String ATTR_USER_NOMBRE = "adminUserNombre";
    public static final String ATTR_USER_EMAIL = "adminUserEmail";
    public static final String ATTR_USER_ROL = "adminUserRol";

    private static final String BEARER_PREFIX = "Bearer ";

    private final TokenService tokenService;
    private final UserRepository userRepository;

    public AdminAuthInterceptor(TokenService tokenService, UserRepository userRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            writeJsonError(response, HttpServletResponse.SC_UNAUTHORIZED, "{\"mensaje\":\"No autenticado\"}");
            return false;
        }

        String token = authHeader.substring(BEARER_PREFIX.length()).trim();
        Optional<TokenService.TokenClaims> claimsOpt = tokenService.verify(token);
        if (claimsOpt.isEmpty()) {
            writeJsonError(response, HttpServletResponse.SC_UNAUTHORIZED, "{\"mensaje\":\"No autenticado\"}");
            return false;
        }

        Optional<User> userOpt = userRepository.findById(claimsOpt.get().id());
        if (userOpt.isEmpty() || !"ADMIN".equals(userOpt.get().getRol())) {
            writeJsonError(response, HttpServletResponse.SC_FORBIDDEN, "{\"mensaje\":\"Acceso solo para administradores\"}");
            return false;
        }

        User adminUser = userOpt.get();
        request.setAttribute(ATTR_USER_ID, adminUser.getId());
        request.setAttribute(ATTR_USER_NOMBRE, adminUser.getNombre());
        request.setAttribute(ATTR_USER_EMAIL, adminUser.getEmail());
        request.setAttribute(ATTR_USER_ROL, adminUser.getRol());
        return true;
    }

    private void writeJsonError(HttpServletResponse response, int status, String jsonBody) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write(jsonBody);
    }
}
