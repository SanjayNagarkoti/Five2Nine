package five2nine.controllers;

import five2nine.dto.*;
import five2nine.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")

public class AuthController
{
    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody RegisterRequest dto) {

        AuthResponse response = authService.registerNewUser(dto);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest dto){
        AuthResponse auth = authService.login(dto);
        return ResponseEntity.ok(auth);

    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> resetPasswordRequest(
            @Valid @RequestBody  ForgotPasswordRequest req){
        System.out.println("Email aa gaya frontend se "+req.email());
        authService.requestPasswordResetLink(req);
        return ResponseEntity.ok(
                "If an account exists for this email, " +
                        "a password reset link has been sent. Check your mail"
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> verifyMail(
            @Valid @RequestBody ResetPasswordRequest request ){
        authService.resetPassword(request);
        return ResponseEntity.ok(
                "Password has been reset succesfully "
        );
    }


}