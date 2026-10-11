
package com.gdg.eventmanagement.controller;

import com.gdg.eventmanagement.entity.Event;
import com.gdg.eventmanagement.service.EventService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService service;

    public EventController(EventService service) {
        this.service = service;
    }

    @PostMapping
    public Event createEvent(@Valid @RequestBody Event event) {
        return service.createEvent(event);
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return service.getAllEvents();
    }

    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) {
        return service.getEventById(id);
    }

    @GetMapping("/{id}/availability")
    public EventService.EventAvailability getRegistrationAvailability(
            @PathVariable Long id) {
        return service.getRegistrationAvailability(id);
    }

    @PutMapping("/{id}")
    public Event updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody Event event) {
        return service.updateEvent(id, event);
    }

    @DeleteMapping("/{id}")
    public String deleteEvent(@PathVariable Long id) {
        service.deleteEvent(id);
        return "Event deleted successfully";
    }



    @GetMapping("/search")
    public List<Event> searchEvents(
            @RequestParam String title) {
        return service.searchEvents(title);
    }

    @GetMapping("/category")
    public List<Event> filterByCategory(
            @RequestParam String category) {
        return service.filterByCategory(category);
    }


}
