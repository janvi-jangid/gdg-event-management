
package com.gdg.eventmanagement.service;

import com.gdg.eventmanagement.entity.AppUser;
import com.gdg.eventmanagement.entity.Event;
import com.gdg.eventmanagement.entity.Registration;
import com.gdg.eventmanagement.EventNotFoundException;
import com.gdg.eventmanagement.repository.AppUserRepository;
import com.gdg.eventmanagement.repository.EventRepository;
import com.gdg.eventmanagement.repository.RegistrationRepository;
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
    public Registration register(String email, Long eventId) {

        if (eventId == null || eventId <= 0) {
            throw new IllegalArgumentException("A valid event ID is required");
        }

        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        Event event = eventRepository.findByIdForUpdate(eventId)
                .orElseThrow(() -> new EventNotFoundException(eventId));

        if (event.getDateTime() == null
                || !event.getDateTime().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Registration is closed for this event");
        }

        if (registrationRepository.existsByUserIdAndEventId(
                user.getId(), eventId)) {
            throw new IllegalArgumentException(
                    "You are already registered for this event");
        }

        long registeredCount =
                registrationRepository.countByEventId(eventId);

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

    public List<Registration> getMyRegistrations(String email) {

        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        return registrationRepository.findByUserId(user.getId());
    }

    @Transactional
    public void unregister(String email, Long eventId) {

        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        Registration registration = registrationRepository
                .findByUserIdAndEventId(user.getId(), eventId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "You are not registered for this event"));

        registrationRepository.delete(registration);
    }
}
