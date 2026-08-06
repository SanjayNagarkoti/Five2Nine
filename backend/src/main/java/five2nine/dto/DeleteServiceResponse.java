package five2nine.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DeleteServiceResponse {
    private Long id;
    private String title;
    private String message;
}
