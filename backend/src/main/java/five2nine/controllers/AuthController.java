package five2nine.controllers;

import five2nine.dto.AuthResponse;
import five2nine.dto.LoginRequest;
import five2nine.dto.RegisterRequest;
import five2nine.service.AuthService;
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




}