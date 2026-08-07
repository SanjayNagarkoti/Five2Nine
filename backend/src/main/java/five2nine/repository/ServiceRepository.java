package five2nine.repository;

import five2nine.entity.Service;
import five2nine.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> , JpaSpecificationExecutor<Service> {
    List<Service> findByFreelancer(User freelancer);
}