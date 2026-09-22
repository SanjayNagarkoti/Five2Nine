package five2nine.controller;

import five2nine.dto.CreateProjectPostRequest;
import five2nine.dto.ProjectPostResponse;
import five2nine.service.ProjectPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectPostController {

    private final ProjectPostService projectPostService;

    @PostMapping
    public ProjectPostResponse createProject(
            @Valid @RequestBody CreateProjectPostRequest request,
            Authentication authentication) {

        return projectPostService.createProjectPost(
                request,
                authentication
        );
    }

    @GetMapping
    public List<ProjectPostResponse> getAllOpenProjects() {

        return projectPostService.getAllOpenProjects();
    }

    @GetMapping("/my")
    public List<ProjectPostResponse> getMyProjects(
            Authentication authentication) {

        return projectPostService.getMyProjects(authentication);
    }

    @GetMapping("/{projectId}")
    public ProjectPostResponse getProjectById(
            @PathVariable Long projectId) {

        return projectPostService.getProjectById(projectId);
    }

    @DeleteMapping("/{projectId}")
    public void deleteProject(
            @PathVariable Long projectId,
            Authentication authentication) {

        projectPostService.deleteProject(
                projectId,
                authentication
        );
    }
}