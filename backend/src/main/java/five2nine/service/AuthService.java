package five2nine.service;

import five2nine.dto.*;
import five2nine.entity.PasswordResetToken;
import five2nine.entity.User;
import five2nine.exception.EmailAlreadyExistsException;
import five2nine.exception.InvalidCredentialsException;
import five2nine.exception.InvalidResetTokenException;
import five2nine.repository.PasswordResetTokenRepository;
import five2nine.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

@Service
public class AuthService {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Autowired
    private UserRepository repo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordResetTokenService passwordResetTokenService;
    public AuthResponse registerNewUser(RegisterRequest dto) {

        if (repo.findByEmail(dto.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        User entity = modelMapper.map(dto, User.class);

        entity.setPassword(passwordEncoder.encode(dto.getPassword()));

        repo.save(entity);

        return new AuthResponse(
                "User Registered Successfully",
                null,
                entity.getName(),
                entity.getEmail(),
                entity.getRole()
        );
    }

    public AuthResponse login(LoginRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }

        User user = repo.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid email or password"
                        )
                );

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                "Login Successful",
                token,
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }


    private String generateResetToken() {

        byte[] randomBytes = new byte[32];

        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }


    private String hashToken(String token) {

        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash =
                    digest.digest(token.getBytes(StandardCharsets.UTF_8));

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                    "SHA-256 algorithm not available", e
            );
        }
    }
    public void requestPasswordResetLink(ForgotPasswordRequest req){
        String email= req.email();
        System.out.println("Email ab reset link ke liye aaya hai method ke ander");
        Optional<User> userOptional = repo.findByEmail(email);

        if (userOptional.isEmpty()) {
            return;
        }

        User user = userOptional.get();

        passwordResetTokenService.deleteByUser(user);

        String rawToken = generateResetToken();

        String hashedToken = hashToken(rawToken);

        PasswordResetToken resetToken = new PasswordResetToken();

        resetToken.setUser(user);
        resetToken.setTokenHash(hashedToken);
        resetToken.setCreatedAt(LocalDateTime.now());
        resetToken.setExpiresAt(
                LocalDateTime.now().plusMinutes(10)
        );

        passwordResetTokenRepository.save(resetToken);

        String resetLink = frontendUrl+"/reset-password?token="+rawToken;
        System.out.println("Reset link ban gaya aur mail sender ko bhej diya gaya hai");
        emailService.sendPasswordResetEmail(user.getEmail(),resetLink);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request){
        String token = request.token();
        String newPassword = request.newPassword();
        String hashedToken = hashToken(token);

        PasswordResetToken resetToken= passwordResetTokenRepository.findByTokenHash(hashedToken)
                .orElseThrow(() ->
                        new InvalidResetTokenException("Token Is Invalid !.. "));
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())){
            passwordResetTokenService.deleteToken(resetToken);;
            throw new InvalidResetTokenException(
                    "Invalid or expired password reset token"
            );
        }

        User user = resetToken.getUser();
        String encodedPassword= passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        repo.save(user);
        passwordResetTokenRepository.delete(resetToken);
    }
}