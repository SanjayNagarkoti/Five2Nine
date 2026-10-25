package five2nine.controllers;

import five2nine.dto.PublicUserProfileResponse;
import five2nine.dto.UpdateUserProfileRequest;
import five2nine.dto.UserProfileResponse;
import five2nine.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public UserProfileResponse getProfile(Authentication authentication) {
        return userService.getCurrentUser(authentication);
    }

    @PutMapping("/profile")
    public UserProfileResponse updateProfile(Authentication authentication,
                                             @RequestBody UpdateUserProfileRequest request) {
        return userService.updateCurrentUserProfile(authentication, request);
    }

    // Partial public profiles are visible even when optional fields are still empty.
    @GetMapping("/{userId}/public-profile")
    public PublicUserProfileResponse getPublicProfile(@PathVariable int userId) {
        return userService.getPublicProfile(userId);
    }
}
