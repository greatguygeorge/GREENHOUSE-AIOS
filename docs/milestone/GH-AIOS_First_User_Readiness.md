# GH-AIOS — First User Readiness

## Greenhouse AI Operating System

**Milestone:** 5  
**Status:** Current  
**Objective:** Prepare GH-AIOS for the first real user using the 80/20 rule.

---

# 1. Current Milestone

GH-AIOS has completed:

1. **Architecture & Foundations**
2. **Knowledge Infrastructure**
3. **Knowledge Acquisition & Retrieval**
4. **Functional MVP Core**

The platform is now entering:

> **Milestone 5 — First User Readiness**

The focus is no longer proving that GH-AIOS can be built.

The focus is proving that:

> **Another person can safely use GH-AIOS without the developer standing beside them.**

---

# 2. Current Platform State

The core intelligence loop is functional:

```text
USER
  │
  ▼
GH-AI-OS UI
  │
  ▼
AI GATEWAY
  │
  ▼
SPECIALIST SERVICE
  │
  ▼
KNOWLEDGE RETRIEVAL SERVICE
  │
  ▼
KNOWLEDGE BASE
  │
  ▼
RELEVANT GREENHOUSE KNOWLEDGE
  │
  ▼
SPECIALIST
  │
  ▼
RESPONSE
  │
  ▼
USER
```

The current implementation includes:

- AI Gateway
- Knowledge Retrieval Service
- Knowledge Acquisition Service
- PostgreSQL
- pgvector
- Ingested Master Handbook
- Working knowledge retrieval
- Specialist services
- Reliable Sponsorship Service workflow
- Greenhouse AI-OS UI
- Request history functionality

The most important validation already achieved is:

> The UI can retrieve relevant Greenhouse organizational knowledge from the ingested Master Handbook.

This establishes the core knowledge-grounded intelligence loop required for the MVP.

---

# 3. Milestone 5 — First User Readiness

## Objective

Prepare the existing functional MVP for safe external access.

This milestone is intentionally narrow.

The goal is not to complete the entire v1.1 architecture.

The goal is:

```text
Functional MVP
      ↓
Secure access
      ↓
Production deployment
      ↓
First real user
      ↓
Real-world feedback
```

---

# 4. 80/20 Priority List

Only capabilities that materially affect first-user access should be prioritized.

## 4.1 Authentication

**Priority: Critical**

The system must know who is allowed to use GH-AIOS.

For the first user, authentication does not need to become a sophisticated enterprise identity platform.

A simple, reliable authenticated access mechanism is sufficient for MVP.

## 4.2 Basic Security

**Priority: Critical**

Before exposing GH-AIOS publicly:

- HTTPS must be enabled.
- Authentication must protect the application.
- Secrets must never be exposed in the frontend.
- n8n must not be unnecessarily exposed publicly.
- PostgreSQL must not be publicly exposed.
- pgvector must not be publicly exposed.
- The Gateway must be protected.
- Basic rate limiting or abuse protection should be implemented.
- CORS should be restricted appropriately.
- Error responses should not expose internal infrastructure details.

This represents the **80/20 security boundary** for the first user.

## 4.3 VPS Deployment

**Priority: Critical**

The VPS converts the current local development environment into an externally accessible deployment.

Target:

```text
greenhouseeffectfestival.online
              │
              ▼
             VPS
              │
       ┌──────┴──────┐
       │             │
      UI          GH-AIOS
                     │
                  Gateway
                     │
                 Services
```

The first user should interact with the public application.

They should not have direct access to n8n, PostgreSQL, pgvector, or internal service infrastructure.

## 4.4 First-User Acceptance Test

**Priority: Critical**

The complete user journey must work end-to-end:

```text
Login
  ↓
Submit request
  ↓
Gateway routes request
  ↓
Specialist executes
  ↓
KRT retrieves knowledge
  ↓
Response appears
  ↓
Request history works
  ↓
User can start another request
```

Basic failure cases should also be tested:

```text
Bad request
Gateway unavailable
Knowledge unavailable
Invalid authentication
Repeated requests
Empty response
```

The objective is not enterprise-scale QA.

The objective is confidence that:

> **One real person can use GH-AIOS without developer intervention.**

---

# 5. What We Are Explicitly NOT Building Yet

The 80/20 rule means the following should remain outside the first-user milestone unless real user feedback makes them necessary.

- **Memory Service** — not required for user #1.
- **Planning Service** — not required for user #1.
- **Analytics Service** — not required for initial validation.
- **Dedicated Security Service** — authentication and infrastructure security controls are sufficient for MVP.
- **Delivery Layer** — external publishing integrations can wait unless the first user's workflow requires them.
- **Repository Restructuring** — do not restructure merely to match v1.1.
- **Additional Specialist Skills** — do not add new specialists without a user-driven need.

---

# 6. Relationship Between v1.0 and v1.1

The stable v1.0 architecture established the foundation:

```text
Gateway
   ↓
Specialists
   ↓
Knowledge Retrieval
   ↓
Knowledge Base
```

The v1.1 proposal defines the longer-term direction:

```text
Gateway
   ↓
Core Services
   ↓
Specialists
   ↓
Knowledge Layer
   ↓
Delivery
```

However, the entire v1.1 architecture does not need to be implemented before finding the first user.

The strategy is incremental evolution.

---

# 7. Current Transition

GH-AIOS is currently transitioning from:

**Functional MVP Core**

to:

**First User Ready**

```text
                    CURRENT
                       │
                       ▼
             ┌──────────────────┐
             │ Functional MVP   │
             │      CORE        │
             └────────┬─────────┘
                      │
                      ▼
             ┌──────────────────┐
             │ FIRST-USER       │
             │ READINESS        │
             │                  │
             │ Authentication   │
             │ Security         │
             │ VPS              │
             │ HTTPS            │
             │ Acceptance Test  │
             └────────┬─────────┘
                      │
                      ▼
                  USER #1
                      │
                      ▼
             Real-world feedback
                      │
                      ▼
             Decide what v1.1
             actually requires
```

---

# 8. Definition of Done

Milestone 5 is complete when:

- [ ] VPS deployed
- [ ] Domain connected
- [ ] HTTPS working
- [ ] Authentication working
- [ ] Internal services protected
- [ ] Gateway protected
- [ ] Frontend production build deployed
- [ ] KRT functionality verified
- [ ] KAS functionality verified
- [ ] Master Handbook retrieval verified
- [ ] Sponsorship workflow verified
- [ ] Request history verified
- [ ] Basic failure/security tests passed
- [ ] First-user workflow completed end-to-end

When these conditions are satisfied:

> **Stop building and give someone access.**

The purpose of the milestone is validation, not additional feature accumulation.

---

# 9. Deployment Timing

The VPS purchase is currently delayed due to financial constraints.

This does not prevent preparation.

Before the VPS is purchased, the following can be completed:

- Authentication design
- Security checklist
- Deployment architecture
- Environment-variable and secrets plan
- Production configuration
- First-user acceptance test
- Basic security testing
- Deployment checklist

When the VPS becomes available, deployment should therefore be an execution step rather than a design exercise.

---

# 10. Next Stage After User #1

After the first user has successfully used GH-AIOS, development should pause long enough to collect real feedback.

The next architecture decisions should be based on actual usage rather than assumptions.

```text
First User
   ↓
Observe
   ↓
Collect Feedback
   ↓
Identify Friction
   ↓
Prioritize
   ↓
Implement Only High-Value Improvements
   ↓
Evolve Toward v1.1
```

This prevents premature development of Memory, Analytics, Planning, Delivery infrastructure, and additional specialist services until there is evidence that they are needed.

---

# 11. Milestone Principle

> **Do not build the future before validating the present.**

GH-AIOS already has a working functional core.

The immediate objective is to make that core:

**Secure → Accessible → Usable → Testable → Ready for User #1**

Only after real-world usage should the platform expand toward the full v1.1 architecture.

---

# 12. Milestone Summary

### Completed

**Milestone 1 — Architecture & Foundations**  
✅ Complete

**Milestone 2 — Knowledge Infrastructure**  
✅ Complete

**Milestone 3 — Knowledge Acquisition & Retrieval**  
✅ Complete

**Milestone 4 — Functional MVP Core**  
✅ Complete

### Current

**Milestone 5 — First User Readiness**  
🟡 In Progress

### Future

**Milestone 6 — Production Hardening**  
⏳ Later

**Milestone 7 — v1.1 Architectural Expansion**  
⏳ Later

---

# Final Objective

The next meaningful milestone is not another AI feature.

It is:

> **GH-AIOS safely serving its first real user.**

That is the immediate 80/20 target.
