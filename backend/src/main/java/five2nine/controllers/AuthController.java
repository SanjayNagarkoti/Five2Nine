package five2nine.controllers;

import five2nine.dto.RegisterRequest;
import five2nine.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/")

public class AuthController
{
    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public String signup(@RequestBody RegisterRequest dto)
    {
    return authService.registerNewUser(dto);
    }
}
