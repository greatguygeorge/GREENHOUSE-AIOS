# ADR-002
# Automated Source Discovery & Human Approval

**Status:** Accepted (Architecture Frozen) 
**Implementation:** Deferred until SDS Build Phase 
**Date:** 2026-07-31 
**Owner:** Greenhouse Futures Lab

---

# Context

The Greenhouse AI-OS will eventually include a **Source Discovery Service (SDS)** capable of discovering new knowledge sources automatically through web search and other discovery mechanisms.

An early proposal allowed newly discovered sources to flow directly into the standard KSR pipeline:

```
Discover
    ↓
Register
    ↓
Validate
    ↓
Activate
    ↓
Ingest
```

This approach introduces a major security and governance risk.

A web search can return:

- spam websites
- SEO farms
- malicious domains
- fake organizations
- outdated sources
- low-quality content

Automatically registering and activating these sources would pollute the knowledge base and undermine trust in the platform.

---

# Problem

Discovery does **not** imply trust.

There must be a governance layer separating:

- discovering a source

from

- trusting a source.

---

# Architectural Principle

> **Discovery never implies trust.**

Every automatically discovered source must be treated as a **candidate**, not an approved knowledge source.

---

# Source Categories

## Manual Registration

A source deliberately registered by an administrator or authorized user.

Example:

- NASA
- UNDP
- MTN
- Greenhouse Effect Initiative

Default characteristics:

- higher initial trust
- no review queue
- follows the normal KSR lifecycle

---

## Automated Discovery

A source discovered by SDS through:

- web search
- search APIs
- RSS discovery
- recommendation engines

Default characteristics:

- low trust
- pending review
- never automatically activated

---

# Revised Architecture

Instead of:

```
SDS
    ↓
Register
    ↓
Validate
    ↓
Activate
```

the architecture becomes:

```
SDS
    ↓
Candidate Source
    ↓
Register
    ↓
Pending Review
    ↓
Human Approval
    ↓
Validate
    ↓
Activate
    ↓
KAS Ingestion
```

---

# Ownership

## SDS

Responsible for:

- discovering sources
- collecting metadata
- assessing domain reputation
- estimating quality

SDS does **NOT** decide trust.

---

## KSR

Responsible for:

- registration
- governance
- lifecycle management
- human approval
- activation

---

## KAS

Responsible only for ingestion.

KAS never decides whether a source should exist.

---

# Governance Fields (Future Schema)

These fields will be added during the SDS implementation phase.

```
approval_status

Possible values

PENDING_REVIEW
APPROVED
REJECTED
```

```
requires_review

BOOLEAN
```

```
reviewed_by
```

```
reviewed_at
```

```
discovery_method

MANUAL
AUTOMATED
```

These fields belong to KSR.

They are never produced by SDS.

---

# SDS Output Contract

SDS returns discovery information only.

Example:

```json
{
    "source_name": "NASA Climate",
    "homepage": "https://climate.nasa.gov",
    "organization": "NASA",
    "source_type": "Website",
    "description": "...",
    "domain_score": 96,
    "reputation_score": 91,
    "discovery_method": "AUTOMATED"
}
```

Notice SDS does **not** return:

- trust_level
- approval_status
- requires_review
- is_verified

Those are governance fields owned by KSR.

---

# Default Trust Policy

## Manual Registration

```
trust_level = 4
```

Lifecycle:

```
REGISTERED
    ↓
VALIDATED
    ↓
ACTIVE
```

---

## Automated Discovery

```
trust_level = 1
approval_status = PENDING_REVIEW
requires_review = TRUE
```

Lifecycle:

```
DISCOVERED
    ↓
REGISTERED
    ↓
PENDING_REVIEW
    ↓
APPROVED
    ↓
VALIDATED
    ↓
ACTIVE
```

---

# Activation Rule

A source may only become ACTIVE when:

```
status == VALIDATED

AND

approval_status == APPROVED
```

This rule prevents automated discoveries from bypassing governance.

---

# Human Review

The review process will become its own KSR workflow during the SDS implementation phase.

Planned workflow:

```
Approve Candidate Source
```

Responsibilities:

- review candidate
- approve
- reject
- record reviewer
- record review timestamp

---

# Security Principle

The platform must never automatically trust information simply because it was discovered.

Every automatically discovered source must pass through explicit governance before entering the knowledge ecosystem.

---

# Implementation Decision

This ADR is **frozen immediately**.

Implementation is intentionally deferred.

The following are **not** implemented during the current KSR build:

- approval_status
- reviewed_by
- reviewed_at
- requires_review
- discovery_method
- candidate approval workflow

These will be implemented together during the Source Discovery Service (SDS) phase.

---

# Rationale

Current project priority:

1. Complete KSR
2. Build KAS single-source ingestion
3. Connect AI Gateway
4. Acquire first user

Introducing the governance layer now would add complexity without any workflows producing automated discoveries.

Freezing the architecture now while staging implementation later provides the best balance between architectural integrity and rapid delivery.