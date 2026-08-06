package five2nine.service;

import five2nine.dto.UserProfileResponse;
import org.springframework.security.core.Authentication;

public interface UserService {

    UserProfileResponse getCurrentUser(Authentication authentication);

}