package five2nine.service;

import five2nine.dto.AuthResponse;
import five2nine.dto.LoginRequest;
import five2nine.dto.RegisterRequest;
import five2nine.entity.User;
import five2nine.exception.EmailAlreadyExistsException;
import five2nine.exception.InvalidCredentialsException;
import five2nine.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

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

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = repo.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException("Invalid email or password"));

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                "Login Successful",
                token,
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}