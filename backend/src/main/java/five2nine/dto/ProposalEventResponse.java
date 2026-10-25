package five2nine.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProposalEventResponse {

    private Long id;

    private Long actorId;
    private String actorName;
    private String actorRole;

    private String action;

    private String changes;

    private String comment;

    private LocalDateTime createdAt;
}