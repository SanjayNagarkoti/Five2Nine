package five2nine.service;

import five2nine.dto.*;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface ProposalService {

    ProposalResponse createFromService(
            Long serviceId,
            CreateServiceProposalRequest request,
            Authentication authentication
    );

    ProposalResponse createFromProject(
            Long projectId,
            CreateProjectProposalRequest request,
            Authentication authentication
    );

    ProposalResponse getProposalById(
            Long proposalId
    );

    List<ProposalResponse> getMyProposals(
            Authentication authentication
    );

    ProposalResponse counterProposal(
            Long proposalId,
            CounterProposalRequest request,
            Authentication authentication
    );

    List<ProposalEventResponse> getProposalHistory(
            Long proposalId,
            Authentication authentication
    );
    ProposalResponse acceptProposal(
            Long proposalId,
            Authentication authentication
    );

    ProposalResponse rejectProposal(
            Long proposalId,
            Authentication authentication
    );
}