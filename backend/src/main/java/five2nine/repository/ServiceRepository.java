package five2nine.repository;

import five2nine.entity.Service;
import five2nine.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByFreelancer(User freelancer);

}