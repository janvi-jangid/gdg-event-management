
package com.gdg.eventmanagement.repository;

import com.gdg.eventmanagement.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByTitleContainingIgnoreCase(String title);

    List<Event> findByCategoryIgnoreCase(String category);
}
