package five2nine.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileResponse {

    private String name;
    private String email;
    private String role;

    public UserProfileResponse() {
    }

    public UserProfileResponse(String name, String email, String role) {
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
