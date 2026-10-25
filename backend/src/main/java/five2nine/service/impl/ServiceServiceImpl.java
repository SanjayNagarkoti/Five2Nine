package five2nine.service.impl;

import five2nine.dto.CreateServiceRequest;
import five2nine.dto.DeleteServiceResponse;
import five2nine.dto.ServiceFilterRequest;
import five2nine.dto.ServiceResponse;
import five2nine.entity.Service;
import five2nine.entity.User;
import five2nine.exception.ServiceNotFoundException;
import five2nine.exception.UnauthorizedServiceException;
import five2nine.repository.ServiceRepository;
import five2nine.service.ServiceService;
import five2nine.specification.ServiceSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import java.util.Objects;
import java.util.List;

@RequiredArgsConstructor
@org.springframework.stereotype.Service
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository serviceRepository;

    private ServiceResponse mapToResponse(Service service) {
        User freelancer = service.getFreelancer();

        return new ServiceResponse(
                service.getId(),
                service.getTitle(),
                service.getDescription(),
                service.getCategory().name(),
                service.getPrice(),
                service.getDeliveryDays(),
                freelancer != null ? freelancer.getName() : null,
                freelancer != null ? freelancer.getId() : null
        );
    }

    @Override
    public ServiceResponse createService(
            CreateServiceRequest request,
            Authentication authentication) {

        User freelancer = (User) authentication.getPrincipal();
        Service service = new Service();
        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setCategory(request.getCategory());
        service.setPrice(request.getPrice());
        service.setDeliveryDays(request.getDeliveryDays());
        service.setFreelancer(freelancer);

        Service savedService = serviceRepository.save(service);
        return mapToResponse(savedService);
    }

    @Override
    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ServiceResponse> getMyServices(Authentication authentication) {
        User freelancer = (User) authentication.getPrincipal();
        return serviceRepository.findByFreelancer(freelancer)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ServiceResponse updateService(
            Long serviceId,
            CreateServiceRequest request,
            Authentication authentication) {

        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ServiceNotFoundException("Service not found"));
        User currentUser = (User) authentication.getPrincipal();

        if (!Objects.equals(
                service.getFreelancer().getId(),
                currentUser.getId()
        )) {
            throw new UnauthorizedServiceException(
                    "You don't have access to this service."
            );
        }

        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setCategory(request.getCategory());
        service.setPrice(request.getPrice());
        service.setDeliveryDays(request.getDeliveryDays());

        Service updatedService = serviceRepository.save(service);
        return mapToResponse(updatedService);
    }

    @Override
    public DeleteServiceResponse deleteService(
            Long serviceId,
            Authentication authentication) {

        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ServiceNotFoundException("Service not found"));
        User currentUser = (User) authentication.getPrincipal();

        if (!Objects.equals(
                service.getFreelancer().getId(),
                currentUser.getId()
        )) {
            throw new UnauthorizedServiceException("You are not authorized to delete this service.");
        }

        DeleteServiceResponse response = new DeleteServiceResponse(
                service.getId(), service.getTitle(), "Service Deleted Successfully"
        );
        serviceRepository.delete(service);
        return response;
    }

    @Override
    public ServiceResponse getServiceById(Long serviceId) {
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ServiceNotFoundException("Service not found"));
        return mapToResponse(service);
    }

    @Override
    public Page<ServiceResponse> getServices(
            ServiceFilterRequest filter,
            Pageable pageable) {

        if (filter.getMinPrice() != null
                && filter.getMaxPrice() != null
                && filter.getMinPrice() > filter.getMaxPrice()) {
            throw new IllegalArgumentException(
                    "Minimum price cannot be greater than maximum price."
            );
        }

        Page<Service> services = serviceRepository.findAll(
                ServiceSpecification.filterServices(filter), pageable
        );
        return services.map(this::mapToResponse);
    }
}
