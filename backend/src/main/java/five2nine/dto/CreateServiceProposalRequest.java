package five2nine.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateServiceProposalRequest {

    @NotBlank(message = "Requirements are required")
    private String requirements;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Expected delivery date is required")
    @FutureOrPresent(message = "Expected delivery date cannot be in the past")
    private LocalDate expectedDeliveryDate;

    private String attachmentName;
    private String attachmentType;
    private Long attachmentSize;
    private String attachmentUrl;

    private String comment;
}