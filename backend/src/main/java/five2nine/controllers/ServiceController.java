package five2nine.controllers;

import five2nine.dto.CreateServiceRequest;
import five2nine.dto.DeleteServiceResponse;
import five2nine.dto.ServiceFilterRequest;
import five2nine.dto.ServiceResponse;
import five2nine.service.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {


    private final ServiceService serviceService;

    @PostMapping
    public ServiceResponse createService(
            @Valid
            @RequestBody CreateServiceRequest request,
            Authentication authentication) {

        return serviceService.createService(request, authentication);
    }
    @GetMapping("/my")
    public List<ServiceResponse> getMyServices(
            Authentication authentication) {

        return serviceService.getMyServices(authentication);

    }
    @PutMapping("/{serviceId}")
    public ServiceResponse updateService(
            @PathVariable long serviceId,
            @Valid @RequestBody CreateServiceRequest request,
            Authentication authentication
    ) {
        return serviceService.updateService(
                serviceId,
                request,
                authentication
        );
    }
    @DeleteMapping("/{serviceId}")
    public DeleteServiceResponse deleteService(
            @PathVariable long serviceId,
            Authentication authentication
    ) {
        return serviceService.deleteService(
                serviceId,
                authentication);
    }
    @GetMapping("/{serviceId}")
    public ServiceResponse getServiceById(
            @PathVariable long serviceId
    ){
        return serviceService.getServiceById(serviceId);
    }
    @GetMapping
    public Page<ServiceResponse> getServices(
            @Valid ServiceFilterRequest filter,
            Pageable pageable) {

        return serviceService.getServices(filter, pageable);
    }
}