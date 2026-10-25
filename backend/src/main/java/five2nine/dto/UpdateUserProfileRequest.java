package five2nine.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserProfileRequest {
    private String headline;
    private String bio;
    private String location;
    private String website;
    private String skills;
    private String experience;
    private String companyName;
    private String companyRole;
    private String hiringFocus;
}
