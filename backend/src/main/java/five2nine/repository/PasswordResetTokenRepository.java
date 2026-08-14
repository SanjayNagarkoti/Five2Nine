package five2nine.repository;

import five2nine.entity.PasswordResetToken;
import five2nine.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {
    void deleteByUser(User user);
    Optional<PasswordResetToken> findByTokenHash(String tokenHash);
}