
package com.gdg.eventmanagement.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // Public endpoints
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/health"
                        ).permitAll()

                        // Anyone can browse events
                        .requestMatchers(HttpMethod.GET, "/api/events/**")
                        .permitAll()

                        // Only admins can modify events
                        .requestMatchers(
                                HttpMethod.POST, "/api/events/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT, "/api/events/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE, "/api/events/**")
                        .hasRole("ADMIN")

                        // All other endpoints require login
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
