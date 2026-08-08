\# docs/adr/README.md



\# Greenhouse AI-OS Architecture Decision Records (ADR)



\## Purpose



This directory contains the official \*\*Architecture Decision Records (ADRs)\*\* for the Greenhouse AI Operating System (GH-AIOS).



ADRs capture significant architectural decisions that affect the design, implementation, and long-term evolution of the operating system. Once an ADR is accepted, it becomes the authoritative reference for development unless explicitly superseded by a later ADR.



The objective of maintaining ADRs is to:



\- Preserve architectural intent.

\- Ensure consistency across subsystems.

\- Prevent undocumented architectural drift.

\- Provide historical context for future contributors.

\- Separate architectural decisions from implementation details.



\---



\# ADR Lifecycle



Each ADR progresses through one of the following states:



| Status | Meaning |

|---------|----------|

| Proposed | Under discussion and not yet adopted |

| Accepted | Approved and considered part of the system architecture |

| Superseded | Replaced by a newer ADR |

| Deprecated | No longer recommended but retained for historical reference |



\---



\# ADR Index



| ADR | Title | Status |

|------|-------|--------|

| ADR-001 | Knowledge Source Governance | Accepted |

| ADR-002 | Executors as Service Boundaries | Accepted |

| ADR-003 | One Workflow, One Responsibility | Accepted |

| ADR-004 | Knowledge Acquisition Pipeline | Accepted |



\---



\# Guiding Principles



The GH-AIOS architecture is guided by several core principles:



\- One workflow should perform one responsibility.

\- Service boundaries are enforced through Executors.

\- Knowledge discovery never implies trust.

\- Every architectural decision should be documented before implementation.

\- Internal services communicate through standardized interfaces.

\- The operating system should remain modular, extensible, and observable.



\---



\# Relationship to the Repository



ADRs describe \*\*how the system should work\*\*.



Technical specifications describe \*\*how components are implemented\*\*.



Workflow JSON files contain the executable implementation.



When implementation conflicts with an accepted ADR, the ADR takes precedence until formally updated.



\---



\*\*Maintained by\*\*



George For Greenhouse Futures Lab



Greenhouse AI Operating System (GH-AIOS)



Version 1.0

