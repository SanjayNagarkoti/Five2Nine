package five2nine.service.impl;

import five2nine.dto.PublicUserProfileResponse;
import five2nine.dto.UpdateUserProfileRequest;
import five2nine.dto.UserProfileResponse;
import five2nine.entity.User;
import five2nine.repository.UserRepository;
import five2nine.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUser(Authentication authentication) {
        User user = currentUser(authentication);
        return toPrivateResponse(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateCurrentUserProfile(Authentication authentication, UpdateUserProfileRequest request) {
        User user = currentUser(authentication);

        // Only profile fields are accepted here. Name, email, role and password cannot be changed via this API.
        if (request.getHeadline() != null) user.setHeadline(clean(request.getHeadline()));
        if (request.getBio() != null) user.setBio(clean(request.getBio()));
        if (request.getLocation() != null) user.setLocation(clean(request.getLocation()));
        if (request.getWebsite() != null) user.setWebsite(clean(request.getWebsite()));
        if (request.getSkills() != null) user.setSkills(clean(request.getSkills()));
        if (request.getExperience() != null) user.setExperience(clean(request.getExperience()));
        if (request.getCompanyName() != null) user.setCompanyName(clean(request.getCompanyName()));
        if (request.getCompanyRole() != null) user.setCompanyRole(clean(request.getCompanyRole()));
        if (request.getHiringFocus() != null) user.setHiringFocus(clean(request.getHiringFocus()));

        validateLengths(user);
        return toPrivateResponse(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public PublicUserProfileResponse getPublicProfile(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        // Deliberately excludes email, password and other private account/security information.
        return new PublicUserProfileResponse(
                user.getId(), user.getName(), user.getRole().name(), user.getHeadline(),
                user.getBio(), user.getLocation(), user.getWebsite(), user.getSkills(),
                user.getExperience(), user.getCompanyName(), user.getCompanyRole(), user.getHiringFocus()
        );
    }

    private User currentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof User user)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        return user;
    }

    private UserProfileResponse toPrivateResponse(User user) {
        return new UserProfileResponse(
                user.getId(), user.getName(), user.getEmail(), user.getRole().name(),
                user.getHeadline(), user.getBio(), user.getLocation(), user.getWebsite(),
                user.getSkills(), user.getExperience(), user.getCompanyName(), user.getCompanyRole(),
                user.getHiringFocus(), calculateCompletion(user), true
        );
    }

    // Signup-required name/email/role are excluded. Six optional fields count equally for either role.
    private int calculateCompletion(User user) {
        List<String> fields = List.of(
                value(user.getBio()), value(user.getLocation()), value(user.getWebsite()),
                value(user.getRole().name().equals("CLIENT") ? user.getCompanyName() : user.getHeadline()),
                value(user.getRole().name().equals("CLIENT") ? user.getCompanyRole() : user.getSkills()),
                value(user.getRole().name().equals("CLIENT") ? user.getHiringFocus() : user.getExperience())
        );
        long completed = fields.stream().filter(field -> !field.isBlank()).count();
        return (int) Math.round((completed * 100.0) / fields.size());
    }

    private String value(String value) {
        return value == null ? "" : value.trim();
    }

    private String clean(String value) {
        if (value == null) return null;
        String cleaned = value.trim();
        return cleaned.isEmpty() ? null : cleaned;
    }

    private void validateLengths(User user) {
        checkLength(user.getHeadline(), 120, "headline");
        checkLength(user.getBio(), 2000, "bio");
        checkLength(user.getLocation(), 120, "location");
        checkLength(user.getWebsite(), 500, "website");
        checkLength(user.getSkills(), 1000, "skills");
        checkLength(user.getExperience(), 80, "experience");
        checkLength(user.getCompanyName(), 160, "companyName");
        checkLength(user.getCompanyRole(), 120, "companyRole");
        checkLength(user.getHiringFocus(), 1000, "hiringFocus");
    }

    private void checkLength(String value, int max, String field) {
        if (value != null && value.length() > max) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    field + " must be at most " + max + " characters");
        }
    }
}
