package five2nine.service;

import five2nine.entity.PasswordResetToken;
import five2nine.entity.User;
import five2nine.repository.PasswordResetTokenRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {

    private final PasswordResetTokenRepository repository;

    @Transactional
    public void deleteByUser(User user) {
        repository.deleteByUser(user);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteToken(PasswordResetToken token) {
        repository.delete(token);
    }
}