package five2nine.dto;

import five2nine.entity.enums.Category;
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
public class CreateProjectPostRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Requirements are required")
    private String requirements;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Minimum budget is required")
    @Positive(message = "Minimum budget must be greater than 0")
    private BigDecimal budgetMin;

    @NotNull(message = "Maximum budget is required")
    @Positive(message = "Maximum budget must be greater than 0")
    private BigDecimal budgetMax;

    @NotNull(message = "Expected delivery date is required")
    @FutureOrPresent(message = "Expected delivery date cannot be in the past")
    private LocalDate expectedDeliveryDate;

    private String attachmentName;

    private String attachmentType;

    private Long attachmentSize;

    private String attachmentUrl;
}