
package com.gdg.eventmanagement.controller;

import com.gdg.eventmanagement.entity.Registration;
import com.gdg.eventmanagement.service.RegistrationService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    public record RegistrationResponse(
            Long id,
            Long eventId,
            String eventTitle,
            LocalDateTime registeredAt
    ) {}

    @PostMapping("/{eventId}")
    public RegistrationResponse registerForEvent(
            @PathVariable Long eventId) {

        Registration registration =
                registrationService.registerForEvent(eventId);

        return new RegistrationResponse(
                registration.getId(),
                registration.getEvent().getId(),
                registration.getEvent().getTitle(),
                registration.getRegisteredAt()
        );
    }

    @GetMapping("/me")
    public List<RegistrationResponse> getMyRegistrations() {
        return registrationService.getMyRegistrations()
                .stream()
                .map(registration -> new RegistrationResponse(
                        registration.getId(),
                        registration.getEvent().getId(),
                        registration.getEvent().getTitle(),
                        registration.getRegisteredAt()
                ))
                .toList();
    }



    @DeleteMapping("/{eventId}")
    public org.springframework.http.ResponseEntity<Void> unregisterFromEvent(
            @PathVariable Long eventId) {

        registrationService.unregisterFromEvent(eventId);

        return org.springframework.http.ResponseEntity.noContent().build();
    }




}