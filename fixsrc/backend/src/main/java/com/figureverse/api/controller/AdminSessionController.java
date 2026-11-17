package com.figureverse.api.controller;

import com.figureverse.api.security.AdminAuthInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminSessionController {

    @GetMapping("/session")
    public ResponseEntity<Map<String, Object>> session(HttpServletRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("ok", true);
        body.put("id", request.getAttribute(AdminAuthInterceptor.ATTR_USER_ID));
        body.put("nombre", request.getAttribute(AdminAuthInterceptor.ATTR_USER_NOMBRE));
        body.put("rol", request.getAttribute(AdminAuthInterceptor.ATTR_USER_ROL));
        return ResponseEntity.ok(body);
    }
}
