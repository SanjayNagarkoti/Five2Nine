package five2nine.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublicUserProfileResponse {
    private Integer id;
    private String name;
    private String role;
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
