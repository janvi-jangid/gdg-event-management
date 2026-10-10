
package com.gdg.eventmanagement.controller;

import com.gdg.eventmanagement.entity.Registration;
import com.gdg.eventmanagement.service.RegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(
            RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    public record RegistrationResponse(
            Long id,
            Long eventId,
            String eventTitle,
            LocalDateTime registeredAt
    ) {}

    @PostMapping("/{eventId}")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistrationResponse registerForEvent(
            @PathVariable Long eventId,
            Authentication authentication) {

        Registration registration =
                registrationService.register(
                        authentication.getName(), eventId);

        return toResponse(registration);
    }

    @GetMapping("/me")
    public List<RegistrationResponse> getMyRegistrations(
            Authentication authentication) {

        return registrationService
                .getMyRegistrations(authentication.getName())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @DeleteMapping("/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unregisterFromEvent(
            @PathVariable Long eventId,
            Authentication authentication) {

        registrationService.unregister(
                authentication.getName(), eventId);
    }

    private RegistrationResponse toResponse(
            Registration registration) {

        return new RegistrationResponse(
                registration.getId(),
                registration.getEvent().getId(),
                registration.getEvent().getTitle(),
                registration.getRegisteredAt()
        );
    }
}
