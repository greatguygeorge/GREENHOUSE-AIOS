# ADR-003
# KSR Internal Communication & Orchestration Strategy

**Status:** Accepted (Architecture Frozen)  
**Date:** 2026-07-31  
**Owner:** Greenhouse Futures Lab

---

# Context

The Knowledge Source Registry (KSR) is being developed incrementally.

As of this milestone, the following workflows have been built independently:

- Register Source
- Validate Source
- Activate Source
- Refresh Source
- Deactivate Source

Each workflow currently begins with a Manual Trigger and executes as an isolated process.

This approach has been valuable during development because each workflow can be tested independently.

However, this is not how the Greenhouse AI-OS will operate once integrated with the AI Gateway.

---

# Current State

Current architecture:

```
Register Source
      │
      X

Validate Source
      │
      X

Activate Source
      │
      X

Refresh Source
      │
      X

Deactivate Source
```

Each workflow:

- owns its own logic
- contains duplicated source lookup logic
- starts with a Manual Trigger
- has no awareness of the other KSR workflows

---

# Target Architecture

The KSR will become a service instead of a collection of isolated workflows.

```
                 AI Gateway
                      │
                      ▼
             KSR Orchestrator
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
  Register       Validate       Activate
       │              │              │
       └──────────┐ Resolve ┌────────┘
                  ▼ Source ▼
             PostgreSQL Knowledge Sources
```

Every KSR workflow becomes an internal service endpoint.

Workflows may be invoked by:

- AI Gateway
- Source Discovery Service (SDS)
- Knowledge Acquisition Service (KAS)
- other KSR workflows

---

# Utility Layer

A shared utility layer will be introduced after all operational workflows are complete.

Planned utility workflows include:

- Resolve Source
- Load Source
- Update Audit
- Write Event

These utilities will eliminate duplicated SQL and duplicated source resolution logic.

Example:

Instead of every workflow querying PostgreSQL independently,

```
Deactivate Source
        │
        ▼
Resolve Source
        │
        ▼
Business Logic
```

---

# KSR Structure

The intended KSR architecture is:

```
KSR
│
├── Orchestrator
│
├── Utilities
│     ├── Resolve Source
│     ├── Load Source
│     ├── Update Audit
│     └── Write Event
│
├── Operations
│     ├── Register
│     ├── Validate
│     ├── Activate
│     ├── Deactivate
│     ├── Reactivate
│     ├── Refresh
│     ├── Update Metadata
│     ├── List Sources
│     ├── Get Source
│     ├── Archive
│     └── Delete
│
└── Governance
      ├── Approve Source
      ├── Reject Source
      └── Review Queue
```

---

# Implementation Strategy

The workflows will **not** be interconnected immediately.

Instead:

### Phase 1

Complete every operational workflow.

- Register
- Validate
- Activate
- Deactivate
- Reactivate
- Refresh
- Update Metadata
- List Sources
- Get Source
- Archive
- Delete

Each workflow remains independently executable.

---

### Phase 2

Introduce shared utilities.

Build:

- GH-AIOS | KSR | Resolve Source | v1

This workflow becomes the common source lookup service used by all KSR operations.

---

### Phase 3

Build:

- GH-AIOS | KSR | Orchestrator | v1

The orchestrator becomes the primary entry point for:

- AI Gateway
- SDS
- KAS
- internal workflow chaining

---

### Phase 4

Refactor the existing operational workflows.

Replace duplicated SQL and Manual Triggers with:

- Execute Workflow nodes
- shared utility calls
- orchestrated execution

---

# Design Principle

> **Build first. Refactor second.**

Operational workflows should be completed and tested independently before introducing orchestration.

This reduces debugging complexity and prevents architectural dependencies from slowing development.

---

# Decision

The KSR will continue to be built as independent operational workflows until all core operations are complete.

Communication between workflows will be introduced later through:

1. KSR Resolve Source
2. KSR Orchestrator
3. Shared utility workflows

This staged approach balances rapid development with long-term maintainability and supports the project's priority of reaching a usable first version for early users.