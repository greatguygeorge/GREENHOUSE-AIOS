\# GH-AIOS Changelog



All notable changes to GH-AIOS are documented here.



\---

\## v1.2.0 — Knowledge-Connected Backend

August 2026



\### Added

\- Centralized Knowledge Acquisition Pipeline (KAP) architecture.

\- KAS Orchestrator workflow for coordinated knowledge acquisition.

\- Master Handbook ingestion workflow.

\- ADR-004 documenting the Knowledge Acquisition Pipeline.

\- v1.2.0 release snapshots for the updated backend workflows.



\### Updated

\- AI Gateway routing and specialist service integration.

\- Knowledge Retrieval Service with the current retrieval pipeline.

\- Research Service with retrieved-knowledge integration.

\- Content Service with retrieved-knowledge integration.

\- Festival Service with retrieved-knowledge integration.

\- Publishing Service with retrieved-knowledge integration.

\- Sponsorship Manager with retrieved-knowledge integration.



\### Backend milestone

\- Completed end-to-end knowledge retrieval from PostgreSQL/pgvector.

\- Connected retrieved Greenhouse knowledge to the Research, Content, Festival, Publishing, and Sponsorship services.

\- Validated specialist-service routing through the AI Gateway.

\- Validated end-to-end retrieval and specialist response generation.



\### Release status

\- v1.0.0 remains frozen as the initial stable release.

\- v1.2.0 represents the current knowledge-connected backend milestone.



\# Version 1.1.0



Release Date: July 2026



Status: Stable Feature Release



\## Overview



GH-AIOS v1.1.0 introduces the Knowledge Ingestion Core of the Greenhouse AI Operating System.



This release establishes the platform's first autonomous learning architecture by enabling continuous knowledge acquisition, processing and storage from multiple external and internal knowledge sources.



The system can now continuously build a persistent organizational knowledge base for the Greenhouse Effect Ecosystem.



\---



\# Added



\## Knowledge Acquisition Service (KAS)



Implemented the orchestration service responsible for coordinating the complete knowledge acquisition lifecycle.



Features:



\- Execution lifecycle management

\- Connector orchestration

\- Acquisition request generation

\- Standard acquisition payload contract

\- Processing Pipeline integration

\- Knowledge Storage Service integration

\- Execution summaries



\---



\## Knowledge Processing Pipeline



Added a dedicated processing workflow between acquisition and storage.



Features:



\- Content normalization

\- HTML cleanup

\- Metadata preservation

\- Payload validation

\- Document chunk preparation

\- Standard processed payload generation



\---



\## Knowledge Storage Service (KSS)



Added centralized semantic knowledge storage.



Supports:



\- Chunk management

\- Embedding generation

\- PostgreSQL storage

\- pgvector integration

\- Metadata persistence

\- Storage summaries



\---



\## Website Connector



Added automated website knowledge acquisition.



Supports:



\- Website crawling

\- HTML extraction

\- Content normalization

\- Standard acquisition payload generation



\---



\## RSS Connector



Added automated RSS feed acquisition.



Supports:



\- RSS parsing

\- Feed normalization

\- Full article extraction

\- Metadata generation

\- Standard acquisition payload generation



\---



\## Google Drive Connector



Added organizational document acquisition.



Supports:



\- Google Docs

\- Google Drive folders

\- Organizational knowledge ingestion

\- Standard acquisition payload generation



\---



\# Architecture Improvements



Established the Knowledge Ingestion Architecture.



Implemented:



\- Modular connector framework

\- Standard acquisition contract

\- Connector abstraction

\- Service orchestration

\- Processing isolation

\- Storage isolation

\- End-to-end ingestion workflow



Knowledge Architecture:



Knowledge Sources



↓



Connectors



↓



Knowledge Acquisition Service



↓



Knowledge Processing Pipeline



↓



Knowledge Storage Service



↓



PostgreSQL + pgvector



\---



\# Improvements



\- Standardized connector outputs

\- Cleaner separation between acquisition, processing and storage

\- Improved workflow modularity

\- Improved service maintainability

\- Consistent metadata handling across connectors



\---



\# Fixed



\- Connector payload inconsistencies

\- Workflow communication between acquisition and storage services

\- Metadata normalization across ingestion workflows



\---



\# Known Limitations



The following services are planned for future versions:



\- Knowledge Sources Registry

\- Advanced Knowledge Retrieval Service

\- Connector scheduling engine

\- Connector health monitoring

\- Automated learning loop

\- Analytics Service

\- Impact measurement system



\---



\# Next Release



\## GH-AIOS v1.2.0



Planned additions:



\- Knowledge Sources Registry

\- Autonomous source scheduling

\- Connector health monitoring

\- Knowledge freshness management

\- Enhanced Knowledge Retrieval

\- Context Builder



\# Version 1.0.0

Release Date: July 2026



Status: Stable Release



\## Overview



GH-AIOS v1.0.0 represents the first stable release of the Greenhouse AI Operating System.



This release establishes the core multi-service AI architecture designed to support the Greenhouse Futures Lab ecosystem.



\---



\# Added



\## AI Gateway



Implemented the central routing intelligence layer responsible for:



\- Receiving user requests

\- Classifying intent

\- Routing tasks to specialist services



\---



\## Knowledge Retrieval Service



Added organizational knowledge retrieval capabilities.



Features:



\- Query generation

\- Semantic knowledge search

\- Context retrieval

\- AI grounding



\---



\## Content Service



Added AI-powered content generation capabilities.



Supports:



\- Social media content

\- Campaign messaging

\- Storytelling

\- Communication materials



\---



\## Research Service



Added research intelligence capabilities.



Supports:



\- Research reports

\- Analysis

\- Summaries

\- Climate intelligence



\---



\## Sponsorship Service



Added partnership development capabilities.



Supports:



\- Sponsorship proposals

\- Partner outreach

\- Funding communication



\---



\## Festival Service



Added festival planning intelligence.



Supports:



\- Programme development

\- Event planning

\- Logistics design

\- Experience planning



\---



\## Publishing Service



Added publishing preparation capabilities.



Supports:



\- Platform-specific content adaptation

\- Distribution workflows



\---



\# Architecture Improvements



Established:



\- Modular AI service architecture

\- Skill-based routing system

\- Knowledge-driven generation

\- Workflow version management



\---



\# Known Limitations



The following services are planned for future versions:



\- Knowledge Acquisition Service

\- Analytics Service

\- Automated learning loop

\- Impact measurement system



\---



\# Next Release



\## GH-AIOS v1.1.0



Planned additions:



\- Knowledge Acquisition Service

\- Expanded knowledge ingestion pipeline

\- Improved retrieval intelligence

\- Additional specialist capabilities



\---



\*\*GH-AIOS\*\*



Building the intelligence layer for climate innovation.

