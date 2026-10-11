
package com.gdg.eventmanagement.service;

import com.gdg.eventmanagement.EventNotFoundException;
import com.gdg.eventmanagement.entity.Event;
import com.gdg.eventmanagement.repository.EventRepository;
import com.gdg.eventmanagement.repository.RegistrationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository repository;
    private final RegistrationRepository registrationRepository;

    public EventService(
            EventRepository repository,
            RegistrationRepository registrationRepository) {
        this.repository = repository;
        this.registrationRepository = registrationRepository;
    }

    public Event createEvent(Event event) {
        return repository.save(event);
    }

    public List<Event> getAllEvents() {
        return repository.findAll();
    }

    public Event getEventById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EventNotFoundException(id));
    }

    public EventAvailability getRegistrationAvailability(Long id) {
        Event event = getEventById(id);
        long registeredCount = registrationRepository.countByEventId(id);
        boolean closed = event.getCapacity() == null
                || registeredCount >= event.getCapacity()
                || event.getDateTime() == null
                || !event.getDateTime().isAfter(java.time.LocalDateTime.now());

        return new EventAvailability(
                event.getId(), event.getCapacity(), registeredCount, closed);
    }

    public record EventAvailability(
            Long eventId,
            Integer capacity,
            long registeredCount,
            boolean closed
    ) {}

    public Event updateEvent(Long id, Event updatedEvent) {
        Event event = repository.findById(id)
                .orElseThrow(() -> new EventNotFoundException(id));

        event.setTitle(updatedEvent.getTitle());
        event.setDescription(updatedEvent.getDescription());
        event.setDateTime(updatedEvent.getDateTime());
        event.setLocation(updatedEvent.getLocation());
        event.setCapacity(updatedEvent.getCapacity());
        event.setCategory(updatedEvent.getCategory());

        return repository.save(event);
    }

    public void deleteEvent(Long id) {
        Event event = repository.findById(id)
                .orElseThrow(() -> new EventNotFoundException(id));

        repository.delete(event);
    }

    public List<Event> searchEvents(String title) {
        return repository.findByTitleContainingIgnoreCase(title);
    }

    public List<Event> filterByCategory(String category) {
        return repository.findByCategoryIgnoreCase(category);
    }
}
