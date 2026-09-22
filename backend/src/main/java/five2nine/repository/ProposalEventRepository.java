package five2nine.repository;

import five2nine.entity.Proposal;
import five2nine.entity.ProposalEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProposalEventRepository
        extends JpaRepository<ProposalEvent, Long> {

    List<ProposalEvent> findByProposalOrderByCreatedAtAsc(
            Proposal proposal
    );
}