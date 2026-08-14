package five2nine.dto;

import five2nine.entity.enums.Category;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServiceFilterRequest {

    private String search;

    private Category category;

    @PositiveOrZero
    private Double minPrice;

    @PositiveOrZero
    private Double maxPrice;

    @PositiveOrZero
    private Integer page = 0;

    @PositiveOrZero
    private Integer size = 10;
}