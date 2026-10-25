package five2nine.repository;

import five2nine.entity.ProjectPost;
import five2nine.entity.Proposal;
import five2nine.entity.Service;
import five2nine.entity.User;
import five2nine.entity.enums.ProposalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProposalRepository extends JpaRepository<Proposal, Long> {

    List<Proposal> findByClient(User client);

    List<Proposal> findByFreelancer(User freelancer);

    List<Proposal> findByService(Service service);

    List<Proposal> findByProjectPost(ProjectPost projectPost);

    boolean existsByClientAndServiceAndStatus(
            User client,
            Service service,
            ProposalStatus status
    );

    boolean existsByFreelancerAndProjectPostAndStatus(
            User freelancer,
            ProjectPost projectPost,
            ProposalStatus status
    );
}