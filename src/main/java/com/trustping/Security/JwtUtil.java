package com.trustping.Security;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;

import com.trustping.config.EnvConfig;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

public class JwtUtil {

	@Autowired
	private EnvConfig envConfig;
	
    private String SECRET_KEY=envConfig.getJwtSecretKey();
    private long EXPIRATON_TIME = 1000 * 60 * 60 * 10;
    private final Key key;
    
    public JwtUtil() {
        this.key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }
    
    // JWT 토큰 생성
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATON_TIME)) 
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
    
    // JWT 토큰 만료 여부 확인
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false; // 유효하지 않은 토큰
        }
    }
    
    // ID 추출
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }



}
