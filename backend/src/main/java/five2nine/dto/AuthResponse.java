package five2nine.dto;

import five2nine.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthResponse {

    private String message;
    private String token;
    private String name;
    private String email;
    private Role role;

}