package five2nine.specification;

import five2nine.dto.ServiceFilterRequest;
import five2nine.entity.Service;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public class ServiceSpecification {

    public static Specification<Service> filterServices(
            ServiceFilterRequest filter) {

        return (root, query, criteriaBuilder) -> {

            Predicate predicate = criteriaBuilder.conjunction();

            // Minimum price
            if (filter.getMinPrice() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.greaterThanOrEqualTo(
                                root.get("price"),
                                filter.getMinPrice()
                        )
                );
            }

            // Maximum price
            if (filter.getMaxPrice() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.lessThanOrEqualTo(
                                root.get("price"),
                                filter.getMaxPrice()
                        )
                );
            }

            // Category
            if (filter.getCategory() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(
                                root.get("category"),
                                filter.getCategory()
                        )
                );
            }

            // Search title OR description
            if (filter.getSearch() != null && !filter.getSearch().isBlank()) {

                String search = filter.getSearch().toLowerCase();

                Predicate titlePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")),
                        "%" + search + "%"
                );

                Predicate descriptionPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("description")),
                        "%" + search + "%"
                );

                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.or(
                                titlePredicate,
                                descriptionPredicate
                        )
                );
            }

            return predicate;
        };
    }
}