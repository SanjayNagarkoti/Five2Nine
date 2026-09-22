package five2nine.dto;

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
public class CounterProposalRequest {

    private String requirements;

    private String description;

    @Positive(message = "Price must be greater than 0")
    private BigDecimal price;

    private LocalDate expectedDeliveryDate;

    private String comment;
}