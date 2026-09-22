package five2nine.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProposalResponse {

    private Long id;

    private Long clientId;
    private String clientName;

    private Long freelancerId;
    private String freelancerName;

    private Long serviceId;
    private String serviceTitle;

    private Long projectPostId;
    private String projectTitle;

    private String source;
    private String initiatedBy;
    private String waitingFor;
    private String status;

    private String requirements;
    private String description;

    private BigDecimal price;
    private LocalDate expectedDeliveryDate;

    private String comment;

    private String attachmentName;
    private String attachmentType;
    private Long attachmentSize;
    private String attachmentUrl;

    private Long version;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}