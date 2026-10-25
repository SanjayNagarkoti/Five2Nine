package five2nine.entity;

import five2nine.entity.enums.ProposalParty;
import five2nine.entity.enums.ProposalSource;
import five2nine.entity.enums.ProposalStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "proposals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Proposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private User freelancer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private Service service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_post_id")
    private ProjectPost projectPost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProposalSource source;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProposalParty initiatedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProposalParty waitingFor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProposalStatus status;

    @Column(length = 2000, nullable = false)
    private String requirements;

    @Column(length = 3000, nullable = false)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private LocalDate expectedDeliveryDate;

    @Column(length = 1000)
    private String comment;

    // Attachment metadata
    private String attachmentName;

    private String attachmentType;

    private Long attachmentSize;

    private String attachmentUrl;

    @Version
    private Long version;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status = ProposalStatus.OPEN;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}