package five2nine.service;

import five2nine.dto.CreateProjectPostRequest;
import five2nine.dto.ProjectPostResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface ProjectPostService {

    ProjectPostResponse createProjectPost(
            CreateProjectPostRequest request,
            Authentication authentication
    );

    List<ProjectPostResponse> getAllOpenProjects();

    List<ProjectPostResponse> getMyProjects(
            Authentication authentication
    );

    ProjectPostResponse getProjectById(Long projectId);

    void deleteProject(
            Long projectId,
            Authentication authentication
    );
}