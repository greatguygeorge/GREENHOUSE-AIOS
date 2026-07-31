Implementation deferred until the Source Discovery Service (SDS) is introduced.

# ADR-001
# Discovery Never Implies Trust

**Status:** ACCEPTED  
**Date:** 2026-07-31  
**Owner:** Greenhouse AI-OS Architecture

---

# Context

Greenhouse AI-OS will eventually discover new knowledge sources automatically through the Source Discovery Service (SDS).

These discoveries may come from:

- Web Search
- RSS Discovery
- PDF Discovery
- API Discovery
- Future autonomous agents

The original architecture allowed these discovered sources to flow directly into:

```
Register
    ↓
Validate
    ↓
Activate
```

This creates an unacceptable governance and security risk.

Automatically discovered sources should never become trusted knowledge sources without governance.

---

# Decision

Greenhouse AI-OS formally adopts the following architectural principle:

> **Discovery never implies trust.**

Discovery only identifies candidate sources.

Trust is established exclusively through the Knowledge Source Registry (KSR).

---

# Responsibilities

## Source Discovery Service (SDS)

Responsible for:

- Discovering websites
- Discovering RSS feeds
- Discovering PDFs
- Discovering APIs
- Ranking candidates
- Estimating confidence

SDS **must never**:

- Assign trust levels
- Activate sources
- Validate sources
- Approve sources

---

## Knowledge Source Registry (KSR)

Responsible for:

- Registering sources
- Validating sources
- Governing lifecycle
- Assigning trust
- Human approval
- Activation

KSR is the only subsystem allowed to decide whether a source becomes trusted.

---

# Governance Model

Every automatically discovered source is treated as a **candidate**.

It must pass governance before becoming trusted.

Example SDS output:

```json
{
  "candidate_id": "...",
  "organization": "MTN",
  "url": "https://www.mtn.com/",
  "discovery_method": "automated_web_search",
  "confidence_score": 0.96
}
```

Notice SDS does **not** output:

- trust_level
- approval_status
- lifecycle_state

Those belong to KSR.

---

# Manual Registration

Manual registration is considered implicitly approved because the administrator performing the registration is also the reviewer.

Default values:

```
source_origin = MANUAL

approval_status = APPROVED

reviewed_by = created_by

reviewed_at = NOW()

requires_review = FALSE
```

---

# Automated Registration

Sources discovered through SDS enter governance differently.

Default values:

```
source_origin = AUTOMATED

approval_status = PENDING

requires_review = TRUE
```

These sources cannot become ACTIVE until reviewed.

---

# Proposed Schema Additions

The following fields will be added to `knowledge_sources`.

| Column | Purpose |
|---------|----------|
| source_origin | MANUAL / AUTOMATED / API / PARTNER |
| discovery_method | How the source was discovered |
| requires_review | Boolean governance flag |
| reviewed_by | Reviewer identity |
| reviewed_at | Review timestamp |
| approval_status | PENDING / APPROVED / REJECTED |

---

# Future Lifecycle

## Manual

```
REGISTERED

↓

VALIDATED

↓

ACTIVE
```

---

## Automated

```
Candidate (SDS)

↓

REGISTERED

↓

PENDING REVIEW

↓

APPROVED

↓

VALIDATED

↓

ACTIVE
```

---

# Security Principle

No autonomous process may expand the trusted knowledge graph without governance.

Autonomous systems may discover knowledge.

Only KSR may approve knowledge.

---

# Consequences

Benefits:

- Prevents database pollution
- Prevents malicious websites becoming trusted
- Preserves governance
- Preserves auditability
- Keeps SDS and KSR cleanly separated

Trade-offs:

- Introduces an approval workflow
- Requires additional metadata
- Requires future UI support

---

# Implementation Strategy

## Phase 1 (Current)

- Freeze this ADR
- Add new database fields
- Continue existing KSR implementation

No workflow behaviour changes.

---

## Phase 2

Complete remaining KSR workflows.

---

## Phase 3

Build Source Discovery Service (SDS).

---

## Phase 4

Implement:

- Review Source workflow
- Approval gate
- Updated Activate Source logic

---

# Deferred Implementation

The approval gate **will not** be implemented immediately.

Reason:

There is currently no subsystem producing `PENDING` sources.

Building the governance workflow before SDS exists provides no realistic way to test it.

The architecture is therefore **accepted now**, while implementation is intentionally deferred until SDS becomes part of the platform.

---

# Current Project Decision

**Architecture Status**

✅ Accepted

**Implementation Status**

⏳ Deferred until Source Discovery Service (SDS) is introduced.

This ADR is now considered the official governance model for all future automated knowledge source discovery within Greenhouse AI-OS.