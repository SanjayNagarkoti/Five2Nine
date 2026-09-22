package five2nine.service;

import five2nine.dto.OrderResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface OrderService {

    List<OrderResponse> getMyOrders(
            Authentication authentication
    );

    OrderResponse getOrderById(
            Long orderId,
            Authentication authentication
    );
}