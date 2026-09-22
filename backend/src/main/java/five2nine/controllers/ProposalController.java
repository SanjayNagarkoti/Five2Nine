package five2nine.controller;

import five2nine.dto.*;
import five2nine.service.ProposalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proposals")
@RequiredArgsConstructor
public class ProposalController {

    private final ProposalService proposalService;

    @PostMapping("/service/{serviceId}")
    public ProposalResponse createFromService(
            @PathVariable Long serviceId,
            @Valid @RequestBody CreateServiceProposalRequest request,
            Authentication authentication) {

        return proposalService.createFromService(
                serviceId,
                request,
                authentication
        );
    }

    @PostMapping("/project/{projectId}")
    public ProposalResponse createFromProject(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateProjectProposalRequest request,
            Authentication authentication) {

        return proposalService.createFromProject(
                projectId,
                request,
                authentication
        );
    }

    @GetMapping("/my")
    public List<ProposalResponse> getMyProposals(
            Authentication authentication) {

        return proposalService.getMyProposals(authentication);
    }

    @GetMapping("/{proposalId}")
    public ProposalResponse getProposal(
            @PathVariable Long proposalId) {

        return proposalService.getProposalById(proposalId);
    }

    @PatchMapping("/{proposalId}/counter")
    public ProposalResponse counterProposal(
            @PathVariable Long proposalId,
            @RequestBody @Valid CounterProposalRequest request,
            Authentication authentication) {

        return proposalService.counterProposal(
                proposalId,
                request,
                authentication
        );
    }

    @GetMapping("/{proposalId}/history")
    public List<ProposalEventResponse> getHistory(
            @PathVariable Long proposalId,
            Authentication authentication) {

        return proposalService.getProposalHistory(
                proposalId,
                authentication
        );
    }
    @PostMapping("/{proposalId}/accept")
    public ProposalResponse acceptProposal(
            @PathVariable Long proposalId,
            Authentication authentication) {

        return proposalService.acceptProposal(
                proposalId,
                authentication
        );
    }
    @PostMapping("/{proposalId}/reject")
    public ProposalResponse rejectProposal(
            @PathVariable Long proposalId,
            Authentication authentication) {

        return proposalService.rejectProposal(
                proposalId,
                authentication
        );
    }
}