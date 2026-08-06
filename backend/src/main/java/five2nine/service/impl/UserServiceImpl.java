package five2nine.service.impl;

import five2nine.dto.UserProfileResponse;
import five2nine.entity.User;
import five2nine.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Override
    public UserProfileResponse getCurrentUser(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return new UserProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}