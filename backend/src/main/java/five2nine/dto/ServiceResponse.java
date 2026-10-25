package five2nine.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ServiceResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private Double price;
    private Integer deliveryDays;
    private String freelancerName;
    private Integer freelancerUserId;
}
