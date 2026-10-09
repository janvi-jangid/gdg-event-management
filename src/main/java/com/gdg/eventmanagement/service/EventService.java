
package com.gdg.eventmanagement.service;

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
}
