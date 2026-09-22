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
public class OrderResponse {

    private Long id;

    private Long proposalId;

    private Long clientId;
    private String clientName;

    private Long freelancerId;
    private String freelancerName;

    private Long serviceId;
    private String serviceTitle;

    private Long projectPostId;
    private String projectTitle;

    private String requirements;
    private String description;

    private BigDecimal agreedPrice;
    private LocalDate agreedDeliveryDate;

    private String attachmentName;
    private String attachmentType;
    private Long attachmentSize;
    private String attachmentUrl;

    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}