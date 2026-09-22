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
public class ProjectPostResponse {

    private Long id;

    private String title;
    private String requirements;
    private String description;
    private String category;

    private BigDecimal budgetMin;
    private BigDecimal budgetMax;

    private LocalDate expectedDeliveryDate;

    private String attachmentName;
    private String attachmentType;
    private Long attachmentSize;
    private String attachmentUrl;

    private String status;

    private String clientName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}