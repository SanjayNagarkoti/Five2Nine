package five2nine.repository;

import five2nine.entity.Order;
import five2nine.entity.Proposal;
import five2nine.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByProposal(Proposal proposal);

    List<Order> findByClient(User client);

    List<Order> findByFreelancer(User freelancer);
}