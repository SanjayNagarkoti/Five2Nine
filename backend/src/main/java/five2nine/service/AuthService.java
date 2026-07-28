package five2nine.service;

import five2nine.dto.RegisterRequest;
import five2nine.entity.User;
import five2nine.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service

public class AuthService {
    @Autowired
    private UserRepository repo;
    @Autowired
    private ModelMapper modelMapper;

    public String registerNewUser(RegisterRequest dto){
        User entity = modelMapper.map(dto, User.class);
        String newUserName= dto.getName();
        repo.save(entity);
        return "Registered Successfully";
    }
}
