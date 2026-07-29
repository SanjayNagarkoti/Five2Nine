package five2nine.service;

import five2nine.dto.RegisterRequest;
import five2nine.entity.User;
import five2nine.exception.EmailAlreadyExistsException;
import five2nine.repository.UserRepository;
import org.hibernate.boot.model.source.spi.SingularAttributeSourceToOne;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service

public class AuthService {
    @Autowired
    private UserRepository repo;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public String registerNewUser(RegisterRequest dto){
        if (repo.findByEmail(dto.getEmail()).isPresent()){
            throw new EmailAlreadyExistsException("Email already registered");

        }
        User entity = modelMapper.map(dto, User.class);
        entity.setPassword(
                passwordEncoder.encode(dto.getPassword())
        );
        repo.save(entity);
        return "Registered Successfully";
    }
}
