
package com.gdg.eventmanagement.repository;

import com.gdg.eventmanagement.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}
