package five2nine.controller;

import five2nine.dto.OrderResponse;
import five2nine.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/my")
    public List<OrderResponse> getMyOrders(
            Authentication authentication) {

        return orderService.getMyOrders(authentication);
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrderById(
            @PathVariable Long orderId,
            Authentication authentication) {

        return orderService.getOrderById(
                orderId,
                authentication
        );
    }
}