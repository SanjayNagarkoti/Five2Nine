package five2nine.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileResponse {
    private Integer id;
    private String name;
    private String email;
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
    private int completionPercent;
    private boolean publicProfile;

    public UserProfileResponse() {}

    public UserProfileResponse(Integer id, String name, String email, String role,
                               String headline, String bio, String location, String website,
                               String skills, String experience, String companyName,
                               String companyRole, String hiringFocus, int completionPercent,
                               boolean publicProfile) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.headline = headline;
        this.bio = bio;
        this.location = location;
        this.website = website;
        this.skills = skills;
        this.experience = experience;
        this.companyName = companyName;
        this.companyRole = companyRole;
        this.hiringFocus = hiringFocus;
        this.completionPercent = completionPercent;
        this.publicProfile = publicProfile;
    }
}
