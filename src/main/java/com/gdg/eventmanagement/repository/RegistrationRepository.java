
package com.gdg.eventmanagement.repository;
import java.util.Optional;
import com.gdg.eventmanagement.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistrationRepository
        extends JpaRepository<Registration, Long> {

    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    List<Registration> findByUserId(Long userId);
    long countByEventId(Long eventId);
    void deleteByUserIdAndEventId(Long userId, Long eventId);
    Optional<Registration> findByUserIdAndEventId(
            Long userId, Long eventId);
}
