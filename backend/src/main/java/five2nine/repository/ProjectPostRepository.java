package five2nine.repository;

import five2nine.entity.ProjectPost;
import five2nine.entity.User;
import five2nine.entity.enums.ProjectPostStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectPostRepository extends JpaRepository<ProjectPost, Long> {

    List<ProjectPost> findByClient(User client);

    List<ProjectPost> findByStatus(ProjectPostStatus status);
}