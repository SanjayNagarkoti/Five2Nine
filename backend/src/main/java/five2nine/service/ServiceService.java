package five2nine.service;

import five2nine.dto.CreateServiceRequest;
import five2nine.dto.DeleteServiceResponse;
import five2nine.dto.ServiceFilterRequest;
import five2nine.dto.ServiceResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface ServiceService {

    ServiceResponse createService(
            CreateServiceRequest request,
            Authentication authentication
    );
    List<ServiceResponse> getAllServices();
    List<ServiceResponse> getMyServices(Authentication authentication);
    ServiceResponse updateService(
            Long serviceId,
            CreateServiceRequest request,
            Authentication authentication
    );
    DeleteServiceResponse deleteService(
            Long serviceId,
            Authentication authentication
    );
    ServiceResponse getServiceById(Long serviceId);
    Page<ServiceResponse> getServices(
            ServiceFilterRequest filter,
            Pageable pageable
    );
}
