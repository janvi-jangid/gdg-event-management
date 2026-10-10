
        package com.gdg.eventmanagement.security;

import com.gdg.eventmanagement.entity.AppUser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;

    public JwtService() {
        String secret = System.getenv("JWT_SECRET");

        if (secret == null || secret.isBlank()) {
            secret = "EventHubLocalDevSecretKey2026MustBeAtLeast32BytesLong";
        }

        this.key = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generateToken(AppUser user) {
        long now = System.currentTimeMillis();

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole())
                .issuedAt(new Date(now))
                .expiration(new Date(now + 86400000))
                .signWith(key)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}
