package five2nine.service.impl;

import five2nine.dto.OrderResponse;
import five2nine.entity.Order;
import five2nine.entity.User;
import five2nine.repository.OrderRepository;
import five2nine.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    @Override
    public List<OrderResponse> getMyOrders(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        List<Order> orders;

        if (user.getRole().name().equals("CLIENT")) {

            orders = orderRepository.findByClient(user);

        } else if (user.getRole().name().equals("FREELANCER")) {

            orders = orderRepository.findByFreelancer(user);

        } else {

            throw new IllegalArgumentException(
                    "Invalid user role."
            );
        }

        return orders.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public OrderResponse getOrderById(
            Long orderId,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Order not found"
                        ));

        if (order.getClient().getId() != user.getId()
                && order.getFreelancer().getId() != user.getId()) {

            throw new IllegalArgumentException(
                    "You are not a participant in this order."
            );
        }

        return mapToResponse(order);
    }

    private OrderResponse mapToResponse(Order order) {

        return new OrderResponse(
                order.getId(),

                order.getProposal().getId(),

                (long) order.getClient().getId(),
                order.getClient().getName(),

                (long) order.getFreelancer().getId(),
                order.getFreelancer().getName(),

                order.getService() != null
                        ? order.getService().getId()
                        : null,

                order.getService() != null
                        ? order.getService().getTitle()
                        : null,

                order.getProjectPost() != null
                        ? order.getProjectPost().getId()
                        : null,

                order.getProjectPost() != null
                        ? order.getProjectPost().getTitle()
                        : null,

                order.getRequirements(),
                order.getDescription(),

                order.getAgreedPrice(),
                order.getAgreedDeliveryDate(),

                order.getAttachmentName(),
                order.getAttachmentType(),
                order.getAttachmentSize(),
                order.getAttachmentUrl(),

                order.getStatus().name(),

                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
}