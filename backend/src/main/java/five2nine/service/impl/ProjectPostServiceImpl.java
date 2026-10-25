package five2nine.service;

import five2nine.dto.CreateProjectPostRequest;
import five2nine.dto.ProjectPostResponse;
import five2nine.entity.ProjectPost;
import five2nine.entity.User;
import five2nine.entity.enums.ProjectPostStatus;
import five2nine.repository.ProjectPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectPostServiceImpl implements ProjectPostService {

    private final ProjectPostRepository projectPostRepository;

    @Override
    public ProjectPostResponse createProjectPost(
            CreateProjectPostRequest request,
            Authentication authentication) {

        User client = (User) authentication.getPrincipal();

        if (request.getBudgetMin().compareTo(request.getBudgetMax()) > 0) {
            throw new IllegalArgumentException(
                    "Minimum budget cannot be greater than maximum budget."
            );
        }

        ProjectPost projectPost = new ProjectPost();

        projectPost.setTitle(request.getTitle());
        projectPost.setRequirements(request.getRequirements());
        projectPost.setDescription(request.getDescription());
        projectPost.setCategory(request.getCategory());

        projectPost.setBudgetMin(request.getBudgetMin());
        projectPost.setBudgetMax(request.getBudgetMax());

        projectPost.setExpectedDeliveryDate(
                request.getExpectedDeliveryDate()
        );

        projectPost.setAttachmentName(request.getAttachmentName());
        projectPost.setAttachmentType(request.getAttachmentType());
        projectPost.setAttachmentSize(request.getAttachmentSize());
        projectPost.setAttachmentUrl(request.getAttachmentUrl());

        projectPost.setClient(client);
        projectPost.setStatus(ProjectPostStatus.OPEN);

        ProjectPost savedPost = projectPostRepository.save(projectPost);

        return mapToResponse(savedPost);
    }

    @Override
    public List<ProjectPostResponse> getAllOpenProjects() {

        return projectPostRepository
                .findByStatus(ProjectPostStatus.OPEN)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ProjectPostResponse> getMyProjects(
            Authentication authentication) {

        User client = (User) authentication.getPrincipal();

        return projectPostRepository
                .findByClient(client)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ProjectPostResponse getProjectById(Long projectId) {

        ProjectPost projectPost = projectPostRepository.findById(projectId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Project post not found"
                        )
                );

        return mapToResponse(projectPost);
    }

    @Override
    public void deleteProject(
            Long projectId,
            Authentication authentication) {

        User client = (User) authentication.getPrincipal();

        ProjectPost projectPost = projectPostRepository.findById(projectId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Project post not found"
                        )
                );

        if (projectPost.getClient().getId() != client.getId()) {
            throw new IllegalArgumentException(
                    "You are not authorized to delete this project."
            );
        }

        projectPost.setStatus(ProjectPostStatus.CANCELLED);

        projectPostRepository.save(projectPost);
    }

    private ProjectPostResponse mapToResponse(ProjectPost projectPost) {

        return new ProjectPostResponse(
                projectPost.getId(),
                projectPost.getTitle(),
                projectPost.getRequirements(),
                projectPost.getDescription(),
                projectPost.getCategory().name(),
                projectPost.getBudgetMin(),
                projectPost.getBudgetMax(),
                projectPost.getExpectedDeliveryDate(),
                projectPost.getAttachmentName(),
                projectPost.getAttachmentType(),
                projectPost.getAttachmentSize(),
                projectPost.getAttachmentUrl(),
                projectPost.getStatus().name(),
                projectPost.getClient().getName(),
                projectPost.getCreatedAt(),
                projectPost.getUpdatedAt()
        );
    }
}