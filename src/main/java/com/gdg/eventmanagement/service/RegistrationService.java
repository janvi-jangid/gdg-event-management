
package com.gdg.eventmanagement.service;

import com.gdg.eventmanagement.entity.AppUser;
import com.gdg.eventmanagement.entity.Event;
import com.gdg.eventmanagement.entity.Registration;
import com.gdg.eventmanagement.repository.AppUserRepository;
import com.gdg.eventmanagement.repository.EventRepository;
import com.gdg.eventmanagement.repository.RegistrationRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final AppUserRepository userRepository;

    public RegistrationService(
            RegistrationRepository registrationRepository,
            EventRepository eventRepository,
            AppUserRepository userRepository) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Registration registerForEvent(Long eventId) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Event not found"));

        if (registrationRepository.existsByUserIdAndEventId(
                user.getId(), eventId)) {
            throw new IllegalArgumentException(
                    "You are already registered for this event");
        }


        long registeredCount = registrationRepository.countByEventId(eventId);

        if (registeredCount >= event.getCapacity()) {
            throw new IllegalArgumentException(
                    "Event has reached full capacity");
        }

        Registration registration = new Registration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setRegisteredAt(LocalDateTime.now());

        return registrationRepository.save(registration);
    }

    public List<Registration> getMyRegistrations() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        return registrationRepository.findByUserId(user.getId());
    }


    @Transactional
    public void unregisterFromEvent(Long eventId) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        if (!registrationRepository.existsByUserIdAndEventId(
                user.getId(), eventId)) {
            throw new IllegalArgumentException(
                    "You are not registered for this event");
        }

        registrationRepository.deleteByUserIdAndEventId(
                user.getId(), eventId);
    }
}