
package com.gdg.eventmanagement.controller;

import com.gdg.eventmanagement.entity.Event;
import com.gdg.eventmanagement.service.EventService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService service;

    public EventController(EventService service) {
        this.service = service;
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return service.createEvent(event);
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return service.getAllEvents();
    }
}
