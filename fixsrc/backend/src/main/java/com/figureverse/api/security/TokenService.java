package com.figureverse.api.security;

import com.figureverse.api.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;

@Service
public class TokenService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final Base64.Encoder URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder URL_DECODER = Base64.getUrlDecoder();

    private final SecretKeySpec secretKeySpec;
    private final long ttlMinutes;

    public TokenService(
            @Value("${app.security.token-secret}") String tokenSecret,
            @Value("${app.security.token-ttl-minutes}") long ttlMinutes) {
        if (tokenSecret == null || tokenSecret.isBlank()) {
            throw new IllegalArgumentException("app.security.token-secret no puede estar vacío");
        }
        if (ttlMinutes <= 0) {
            throw new IllegalArgumentException("app.security.token-ttl-minutes debe ser mayor que 0");
        }
        this.secretKeySpec = new SecretKeySpec(tokenSecret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
        this.ttlMinutes = ttlMinutes;
    }

    public String generate(User user) {
        if (user == null || user.getId() == null || user.getRol() == null || user.getRol().isBlank()) {
            throw new IllegalArgumentException("Usuario inválido para generar token");
        }
        long expirationEpochMillis = System.currentTimeMillis() + (ttlMinutes * 60_000L);
        String payload = user.getId() + "." + user.getRol() + "." + expirationEpochMillis;
        String encodedPayload = URL_ENCODER.encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        byte[] signature = sign(encodedPayload.getBytes(StandardCharsets.UTF_8));
        String encodedSignature = URL_ENCODER.encodeToString(signature);
        return encodedPayload + "." + encodedSignature;
    }

    public Optional<TokenClaims> verify(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        String[] parts = token.split("\\.", -1);
        if (parts.length != 2 || parts[0].isEmpty() || parts[1].isEmpty()) {
            return Optional.empty();
        }

        byte[] providedSignature;
        byte[] payloadBytes;
        try {
            providedSignature = URL_DECODER.decode(parts[1]);
            payloadBytes = URL_DECODER.decode(parts[0]);
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }

        byte[] expectedSignature = sign(parts[0].getBytes(StandardCharsets.UTF_8));
        if (!MessageDigest.isEqual(expectedSignature, providedSignature)) {
            return Optional.empty();
        }

        String payload = new String(payloadBytes, StandardCharsets.UTF_8);
        String[] payloadParts = payload.split("\\.", -1);
        if (payloadParts.length != 3) {
            return Optional.empty();
        }

        try {
            long id = Long.parseLong(payloadParts[0]);
            String rol = payloadParts[1];
            long expirationEpochMillis = Long.parseLong(payloadParts[2]);

            if (rol.isBlank() || expirationEpochMillis <= System.currentTimeMillis()) {
                return Optional.empty();
            }
            return Optional.of(new TokenClaims(id, rol));
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }

    private byte[] sign(byte[] data) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(secretKeySpec);
            return mac.doFinal(data);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new IllegalStateException("No se pudo calcular la firma HMAC", e);
        }
    }

    public record TokenClaims(Long id, String rol) {
    }
}
