package five2nine.entity;

import five2nine.entity.enums.ProposalEventAction;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "proposal_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProposalEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "proposal_id", nullable = false)
    private Proposal proposal;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "actor_id", nullable = false)
    private User actor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProposalEventAction action;

    /**
     * Stores only changed fields as JSON.
     *
     * Example:
     * {
     *   "price": {
     *      "from": 20000,
     *      "to": 15000
     *   }
     * }
     */
    @Column(columnDefinition = "TEXT")
    private String changes;

    @Column(length = 1000)
    private String comment;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}