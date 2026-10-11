package com.gdg.eventmanagement.service;

import com.gdg.eventmanagement.EventNotFoundException;
import com.gdg.eventmanagement.entity.AppUser;
import com.gdg.eventmanagement.entity.Event;
import com.gdg.eventmanagement.entity.Registration;
import com.gdg.eventmanagement.repository.AppUserRepository;
import com.gdg.eventmanagement.repository.EventRepository;
import com.gdg.eventmanagement.repository.RegistrationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @Mock
    private RegistrationRepository registrationRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private AppUserRepository userRepository;

    @InjectMocks
    private RegistrationService service;

    private AppUser user;
    private Event event;

    @BeforeEach
    void setUp() {
        user = new AppUser();
        user.setEmail("member@example.com");

        event = new Event();
        event.setId(42L);
        event.setTitle("GDG Workshop");
        event.setCapacity(2);
        event.setDateTime(LocalDateTime.now().plusDays(2));
    }

    @Test
    void registersAuthenticatedUserForAvailableEvent() {
        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));
        when(eventRepository.findByIdForUpdate(event.getId()))
                .thenReturn(Optional.of(event));
        when(registrationRepository.existsByUserIdAndEventId(null, event.getId()))
                .thenReturn(false);
        when(registrationRepository.countByEventId(event.getId())).thenReturn(0L);
        when(registrationRepository.save(any(Registration.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Registration registration = service.register(user.getEmail(), event.getId());

        assertSame(user, registration.getUser());
        assertSame(event, registration.getEvent());
        assertNotNull(registration.getRegisteredAt());
        verify(eventRepository).findByIdForUpdate(event.getId());
    }

    @Test
    void rejectsDuplicateRegistration() {
        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));
        when(eventRepository.findByIdForUpdate(event.getId()))
                .thenReturn(Optional.of(event));
        when(registrationRepository.existsByUserIdAndEventId(null, event.getId()))
                .thenReturn(true);

        IllegalArgumentException error = assertThrows(
                IllegalArgumentException.class,
                () -> service.register(user.getEmail(), event.getId()));

        assertTrue(error.getMessage().contains("already registered"));
        verify(registrationRepository, never()).save(any());
    }

    @Test
    void rejectsRegistrationWhenCapacityIsFull() {
        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));
        when(eventRepository.findByIdForUpdate(event.getId()))
                .thenReturn(Optional.of(event));
        when(registrationRepository.existsByUserIdAndEventId(null, event.getId()))
                .thenReturn(false);
        when(registrationRepository.countByEventId(event.getId())).thenReturn(2L);

        IllegalArgumentException error = assertThrows(
                IllegalArgumentException.class,
                () -> service.register(user.getEmail(), event.getId()));

        assertTrue(error.getMessage().contains("capacity"));
        verify(registrationRepository, never()).save(any());
    }

    @Test
    void rejectsPastEvent() {
        event.setDateTime(LocalDateTime.now().minusMinutes(1));
        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));
        when(eventRepository.findByIdForUpdate(event.getId()))
                .thenReturn(Optional.of(event));

        IllegalArgumentException error = assertThrows(
                IllegalArgumentException.class,
                () -> service.register(user.getEmail(), event.getId()));

        assertTrue(error.getMessage().contains("closed"));
        verify(registrationRepository, never()).save(any());
    }

    @Test
    void rejectsMissingEvent() {
        when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));
        when(eventRepository.findByIdForUpdate(event.getId()))
                .thenReturn(Optional.empty());

        assertThrows(EventNotFoundException.class,
                () -> service.register(user.getEmail(), event.getId()));
    }
}
