package five2nine.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import five2nine.dto.CounterProposalRequest;
import five2nine.dto.CreateProjectProposalRequest;
import five2nine.dto.CreateServiceProposalRequest;
import five2nine.dto.ProposalEventResponse;
import five2nine.dto.ProposalResponse;
import five2nine.entity.*;
import five2nine.entity.enums.ProposalEventAction;
import five2nine.entity.enums.ProposalParty;
import five2nine.entity.enums.ProposalSource;
import five2nine.entity.enums.ProposalStatus;
import five2nine.entity.enums.Role;
import five2nine.repository.*;
import five2nine.service.ProposalService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@org.springframework.stereotype.Service
public class ProposalServiceImpl implements ProposalService {

    private final ProposalRepository proposalRepository;
    private final ProposalEventRepository proposalEventRepository;
    private final ServiceRepository serviceRepository;
    private final ProjectPostRepository projectPostRepository;
    private final ObjectMapper objectMapper;
    private final OrderRepository orderRepository;

    // =========================================================
    // CLIENT -> FREELANCER THROUGH SERVICE
    // =========================================================

    @Override
    @Transactional
    public ProposalResponse createFromService(
            Long serviceId,
            CreateServiceProposalRequest request,
            Authentication authentication) {

        User client = (User) authentication.getPrincipal();

        // Only CLIENT can initiate proposal from a freelancer's service
        if (client.getRole() != Role.CLIENT) {
            throw new IllegalArgumentException(
                    "Only clients can approach freelancers through services."
            );
        }

        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Service not found"
                        )
                );

        // Prevent duplicate active proposal for same client + service
        if (proposalRepository.existsByClientAndServiceAndStatus(
                client,
                service,
                ProposalStatus.OPEN)) {

            throw new IllegalArgumentException(
                    "You already have an active proposal for this service."
            );
        }

        Proposal proposal = new Proposal();

        proposal.setClient(client);
        proposal.setFreelancer(service.getFreelancer());

        proposal.setService(service);
        proposal.setProjectPost(null);

        proposal.setSource(ProposalSource.SERVICE);
        proposal.setInitiatedBy(ProposalParty.CLIENT);

        // Freelancer must respond first
        proposal.setWaitingFor(ProposalParty.FREELANCER);

        proposal.setStatus(ProposalStatus.OPEN);

        proposal.setRequirements(request.getRequirements());
        proposal.setDescription(request.getDescription());

        proposal.setPrice(request.getPrice());

        proposal.setExpectedDeliveryDate(
                request.getExpectedDeliveryDate()
        );

        proposal.setComment(request.getComment());

        // Attachment
        proposal.setAttachmentName(request.getAttachmentName());
        proposal.setAttachmentType(request.getAttachmentType());
        proposal.setAttachmentSize(request.getAttachmentSize());
        proposal.setAttachmentUrl(request.getAttachmentUrl());

        Proposal savedProposal = proposalRepository.save(proposal);

        return mapToResponse(savedProposal);
    }


    // =========================================================
    // FREELANCER -> CLIENT THROUGH PROJECT
    // =========================================================

    @Override
    @Transactional
    public ProposalResponse createFromProject(
            Long projectId,
            CreateProjectProposalRequest request,
            Authentication authentication) {

        User freelancer = (User) authentication.getPrincipal();

        // Only FREELANCER can apply to client projects
        if (freelancer.getRole() != Role.FREELANCER) {
            throw new IllegalArgumentException(
                    "Only freelancers can apply to client projects."
            );
        }

        ProjectPost projectPost = projectPostRepository.findById(projectId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Project post not found"
                        )
                );

        // Project must be open
        if (projectPost.getStatus() == null ||
                !projectPost.getStatus().name().equals("OPEN")) {

            throw new IllegalArgumentException(
                    "This project is no longer accepting proposals."
            );
        }

        // Prevent duplicate active proposal
        if (proposalRepository.existsByFreelancerAndProjectPostAndStatus(
                freelancer,
                projectPost,
                ProposalStatus.OPEN)) {

            throw new IllegalArgumentException(
                    "You already have an active proposal for this project."
            );
        }

        Proposal proposal = new Proposal();

        proposal.setClient(projectPost.getClient());
        proposal.setFreelancer(freelancer);

        proposal.setService(null);
        proposal.setProjectPost(projectPost);

        proposal.setSource(ProposalSource.PROJECT);
        proposal.setInitiatedBy(ProposalParty.FREELANCER);

        // Client must respond first
        proposal.setWaitingFor(ProposalParty.CLIENT);

        proposal.setStatus(ProposalStatus.OPEN);

        /*
         * Snapshot the project details into the proposal.
         * This protects the proposal from future changes to ProjectPost.
         */
        proposal.setRequirements(projectPost.getRequirements());
        proposal.setDescription(projectPost.getDescription());

        proposal.setPrice(request.getPrice());

        proposal.setExpectedDeliveryDate(
                request.getExpectedDeliveryDate()
        );

        proposal.setComment(request.getComment());

        // Copy project attachment metadata
        proposal.setAttachmentName(projectPost.getAttachmentName());
        proposal.setAttachmentType(projectPost.getAttachmentType());
        proposal.setAttachmentSize(projectPost.getAttachmentSize());
        proposal.setAttachmentUrl(projectPost.getAttachmentUrl());

        Proposal savedProposal = proposalRepository.save(proposal);

        return mapToResponse(savedProposal);
    }


    // =========================================================
    // GET PROPOSAL BY ID
    // =========================================================

    @Override
    public ProposalResponse getProposalById(Long proposalId) {

        Proposal proposal = getProposal(proposalId);

        return mapToResponse(proposal);
    }


    // =========================================================
    // GET MY PROPOSALS
    // =========================================================

    @Override
    public List<ProposalResponse> getMyProposals(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        List<Proposal> proposals;

        if (user.getRole() == Role.CLIENT) {

            proposals = proposalRepository.findByClient(user);

        } else if (user.getRole() == Role.FREELANCER) {

            proposals = proposalRepository.findByFreelancer(user);

        } else {

            throw new IllegalArgumentException(
                    "Invalid user role."
            );
        }

        return proposals.stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // COUNTER PROPOSAL
    // =========================================================

    @Override
    @Transactional
    public ProposalResponse counterProposal(
            Long proposalId,
            CounterProposalRequest request,
            Authentication authentication) {

        User actor = (User) authentication.getPrincipal();

        Proposal proposal = getProposal(proposalId);
//        System.out.println("========== PROPOSAL DEBUG ==========");
//        System.out.println("JWT USER ID: " + actor.getId());
//        System.out.println("JWT USER EMAIL: " + actor.getEmail());
//        System.out.println("PROPOSAL CLIENT ID: " + proposal.getClient().getId());
//        System.out.println("PROPOSAL FREELANCER ID: " + proposal.getFreelancer().getId());
//        System.out.println("WAITING FOR: " + proposal.getWaitingFor());
//        System.out.println("====================================");

        // Proposal must still be open
        if (proposal.getStatus() != ProposalStatus.OPEN) {
            throw new IllegalArgumentException(
                    "This proposal is no longer open."
            );
        }

        // -----------------------------------------------------
        // Identify who is making this request
        // -----------------------------------------------------

        ProposalParty actorParty;

        if (proposal.getClient().getId() == actor.getId()) {

            actorParty = ProposalParty.CLIENT;

        } else if (proposal.getFreelancer().getId() == actor.getId()) {

            actorParty = ProposalParty.FREELANCER;

        } else {

            throw new IllegalArgumentException(
                    "You are not a participant in this proposal."
            );
        }

        // -----------------------------------------------------
        // Only the party whose turn it is can respond
        // -----------------------------------------------------

        if (proposal.getWaitingFor() != actorParty) {

            throw new IllegalArgumentException(
                    "It is not your turn to respond to this proposal."
            );
        }

        // -----------------------------------------------------
        // Freelancer cannot modify requirements/description
        // -----------------------------------------------------

        if (actorParty == ProposalParty.FREELANCER) {

            if (request.getRequirements() != null ||
                    request.getDescription() != null) {

                throw new IllegalArgumentException(
                        "Freelancers cannot change requirements or description."
                );
            }
        }

        // -----------------------------------------------------
        // Track only the fields which actually changed
        // -----------------------------------------------------

        Map<String, Object> changes = new LinkedHashMap<>();


        // =====================================================
        // REQUIREMENTS
        // =====================================================

        if (request.getRequirements() != null) {

            addChange(
                    changes,
                    "requirements",
                    proposal.getRequirements(),
                    request.getRequirements()
            );

            proposal.setRequirements(
                    request.getRequirements()
            );
        }


        // =====================================================
        // DESCRIPTION
        // =====================================================

        if (request.getDescription() != null) {

            addChange(
                    changes,
                    "description",
                    proposal.getDescription(),
                    request.getDescription()
            );

            proposal.setDescription(
                    request.getDescription()
            );
        }


        // =====================================================
        // PRICE
        // =====================================================

        if (request.getPrice() != null) {

            addChange(
                    changes,
                    "price",
                    proposal.getPrice(),
                    request.getPrice()
            );

            proposal.setPrice(
                    request.getPrice()
            );
        }


        // =====================================================
        // DELIVERY DATE
        // =====================================================

        if (request.getExpectedDeliveryDate() != null) {

            addChange(
                    changes,
                    "expectedDeliveryDate",
                    proposal.getExpectedDeliveryDate(),
                    request.getExpectedDeliveryDate()
            );

            proposal.setExpectedDeliveryDate(
                    request.getExpectedDeliveryDate()
            );
        }


        // =====================================================
        // COMMENT
        // =====================================================

        if (request.getComment() != null) {

            addChange(
                    changes,
                    "comment",
                    proposal.getComment(),
                    request.getComment()
            );

            proposal.setComment(
                    request.getComment()
            );
        }


        // -----------------------------------------------------
        // Nothing was changed
        // -----------------------------------------------------

        if (changes.isEmpty()) {

            throw new IllegalArgumentException(
                    "At least one change is required."
            );
        }


        // -----------------------------------------------------
        // Switch turn
        // -----------------------------------------------------

        proposal.setWaitingFor(
                actorParty == ProposalParty.CLIENT
                        ? ProposalParty.FREELANCER
                        : ProposalParty.CLIENT
        );


        // -----------------------------------------------------
        // Save updated proposal
        // -----------------------------------------------------

        Proposal savedProposal = proposalRepository.save(proposal);


        // -----------------------------------------------------
        // Save history event
        // -----------------------------------------------------

        ProposalEvent event = new ProposalEvent();

        event.setProposal(savedProposal);
        event.setActor(actor);
        event.setAction(ProposalEventAction.COUNTERED);
        event.setChanges(toJson(changes));
        event.setComment(request.getComment());

        proposalEventRepository.save(event);


        return mapToResponse(savedProposal);
    }


    // =========================================================
    // GET PROPOSAL HISTORY
    // =========================================================

    @Override
    public List<ProposalEventResponse> getProposalHistory(
            Long proposalId,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        Proposal proposal = getProposal(proposalId);

        ensureParticipant(proposal, user);

        return proposalEventRepository
                .findByProposalOrderByCreatedAtAsc(proposal)
                .stream()
                .map(event -> new ProposalEventResponse(
                        event.getId(),

                        (long) event.getActor().getId(),

                        event.getActor().getName(),

                        event.getActor().getRole().name(),

                        event.getAction().name(),

                        event.getChanges(),

                        event.getComment(),

                        event.getCreatedAt()
                ))
                .toList();
    }


    // =========================================================
    // GET PROPOSAL
    // =========================================================

    private Proposal getProposal(Long proposalId) {

        return proposalRepository.findById(proposalId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Proposal not found"
                        )
                );
    }


    // =========================================================
    // CHECK PARTICIPANT
    // =========================================================

    private void ensureParticipant(
            Proposal proposal,
            User user) {

        if (proposal.getClient().getId() != user.getId()
                && proposal.getFreelancer().getId() != user.getId()) {

            throw new IllegalArgumentException(
                    "You are not a participant in this proposal."
            );
        }
    }


    // =========================================================
    // ADD CHANGE TO HISTORY
    // =========================================================

    private void addChange(
            Map<String, Object> changes,
            String field,
            Object from,
            Object to) {

        if (from == null && to == null) {
            return;
        }

        if (from != null && from.equals(to)) {
            return;
        }

        Map<String, Object> difference = new LinkedHashMap<>();

        difference.put("from", from);
        difference.put("to", to);

        changes.put(field, difference);
    }


    // =========================================================
    // CONVERT CHANGES TO JSON
    // =========================================================

    private String toJson(
            Map<String, Object> changes) {

        try {

            return objectMapper.writeValueAsString(changes);

        } catch (JsonProcessingException e) {

            throw new IllegalStateException(
                    "Failed to create proposal history."
            );
        }
    }


    // =========================================================
    // MAP ENTITY -> RESPONSE DTO
    // =========================================================

    private ProposalResponse mapToResponse(
            Proposal proposal) {

        return new ProposalResponse(

                proposal.getId(),

                // User.id is int -> DTO expects Long
                (long) proposal.getClient().getId(),
                proposal.getClient().getName(),

                (long) proposal.getFreelancer().getId(),
                proposal.getFreelancer().getName(),

                proposal.getService() != null
                        ? proposal.getService().getId()
                        : null,

                proposal.getService() != null
                        ? proposal.getService().getTitle()
                        : null,

                proposal.getProjectPost() != null
                        ? proposal.getProjectPost().getId()
                        : null,

                proposal.getProjectPost() != null
                        ? proposal.getProjectPost().getTitle()
                        : null,

                proposal.getSource().name(),

                proposal.getInitiatedBy().name(),

                proposal.getWaitingFor().name(),

                proposal.getStatus().name(),

                proposal.getRequirements(),

                proposal.getDescription(),

                proposal.getPrice(),

                proposal.getExpectedDeliveryDate(),

                proposal.getComment(),

                proposal.getAttachmentName(),

                proposal.getAttachmentType(),

                proposal.getAttachmentSize(),

                proposal.getAttachmentUrl(),

                proposal.getVersion(),

                proposal.getCreatedAt(),

                proposal.getUpdatedAt()
        );

    }
    @Override
    @Transactional
    public ProposalResponse acceptProposal(
            Long proposalId,
            Authentication authentication) {

        User actor = (User) authentication.getPrincipal();

        Proposal proposal = getProposal(proposalId);

        if (proposal.getStatus() != ProposalStatus.OPEN) {
            throw new IllegalArgumentException(
                    "This proposal is no longer open."
            );
        }

        ProposalParty actorParty;

        if (proposal.getClient().getId() == actor.getId()) {
            actorParty = ProposalParty.CLIENT;
        } else if (proposal.getFreelancer().getId() == actor.getId()) {
            actorParty = ProposalParty.FREELANCER;
        } else {
            throw new IllegalArgumentException(
                    "You are not a participant in this proposal."
            );
        }

        if (proposal.getWaitingFor() != actorParty) {
            throw new IllegalArgumentException(
                    "It is not your turn to respond to this proposal."
            );
        }

        proposal.setStatus(ProposalStatus.ACCEPTED);

        Proposal savedProposal = proposalRepository.save(proposal);

        Order order = new Order();

        order.setProposal(savedProposal);
        order.setClient(savedProposal.getClient());
        order.setFreelancer(savedProposal.getFreelancer());

        order.setService(savedProposal.getService());
        order.setProjectPost(savedProposal.getProjectPost());

        order.setRequirements(savedProposal.getRequirements());
        order.setDescription(savedProposal.getDescription());

        order.setAgreedPrice(savedProposal.getPrice());
        order.setAgreedDeliveryDate(
                savedProposal.getExpectedDeliveryDate()
        );

        order.setAttachmentName(savedProposal.getAttachmentName());
        order.setAttachmentType(savedProposal.getAttachmentType());
        order.setAttachmentSize(savedProposal.getAttachmentSize());
        order.setAttachmentUrl(savedProposal.getAttachmentUrl());

        orderRepository.save(order);

        ProposalEvent event = new ProposalEvent();

        event.setProposal(savedProposal);
        event.setActor(actor);
        event.setAction(ProposalEventAction.ACCEPTED);
        event.setChanges(null);
        event.setComment("Proposal accepted.");

        proposalEventRepository.save(event);

        return mapToResponse(savedProposal);
    }
    @Override
    @Transactional
    public ProposalResponse rejectProposal(
            Long proposalId,
            Authentication authentication) {

        User actor = (User) authentication.getPrincipal();

        Proposal proposal = getProposal(proposalId);

        if (proposal.getStatus() != ProposalStatus.OPEN) {
            throw new IllegalArgumentException(
                    "This proposal is no longer open."
            );
        }

        ProposalParty actorParty;

        if (proposal.getClient().getId() == actor.getId()) {
            actorParty = ProposalParty.CLIENT;
        } else if (proposal.getFreelancer().getId() == actor.getId()) {
            actorParty = ProposalParty.FREELANCER;
        } else {
            throw new IllegalArgumentException(
                    "You are not a participant in this proposal."
            );
        }

        if (proposal.getWaitingFor() != actorParty) {
            throw new IllegalArgumentException(
                    "It is not your turn to respond to this proposal."
            );
        }

        proposal.setStatus(ProposalStatus.REJECTED);

        Proposal savedProposal = proposalRepository.save(proposal);

        ProposalEvent event = new ProposalEvent();

        event.setProposal(savedProposal);
        event.setActor(actor);
        event.setAction(ProposalEventAction.REJECTED);
        event.setChanges(null);
        event.setComment("Proposal rejected.");

        proposalEventRepository.save(event);

        return mapToResponse(savedProposal);
    }
}