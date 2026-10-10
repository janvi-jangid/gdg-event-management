
package com.gdg.eventmanagement.service;

import com.gdg.eventmanagement.EventNotFoundException;
import com.gdg.eventmanagement.entity.Event;
import com.gdg.eventmanagement.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository repository;

    public EventService(EventRepository repository) {
        this.repository = repository;
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
