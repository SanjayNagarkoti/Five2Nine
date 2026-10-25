package five2nine.service;

import five2nine.dto.PublicUserProfileResponse;
import five2nine.dto.UpdateUserProfileRequest;
import five2nine.dto.UserProfileResponse;
import org.springframework.security.core.Authentication;

public interface UserService {
    UserProfileResponse getCurrentUser(Authentication authentication);
    UserProfileResponse updateCurrentUserProfile(Authentication authentication, UpdateUserProfileRequest request);
    PublicUserProfileResponse getPublicProfile(int userId);
}
