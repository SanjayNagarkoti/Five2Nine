package five2nine.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterRequest {
//    private int id;
    private String name;
    private String email;
    private String password;
    private String role;
}
