\# ADR-004 — Knowledge Acquisition Pipeline (KAP)



\*\*Status:\*\* Accepted



\*\*Date:\*\* August 2026



\*\*Version:\*\* 1.0



\---



\# Context



GH-AIOS requires a standardized method for introducing new knowledge into the operating system.



Knowledge may originate from many different sources including:



\- Markdown documents

\- PDF documents

\- DOCX files

\- Websites

\- RSS feeds

\- APIs

\- GitHub repositories

\- Google Docs

\- Future external connectors



Without a dedicated acquisition layer, each knowledge source would require custom integration directly into downstream services, resulting in duplicated logic, inconsistent metadata, and tightly coupled workflows.



The operating system therefore requires a single, standardized entry point for all knowledge assets.



\---



\# Decision



GH-AIOS SHALL implement a centralized \*\*Knowledge Acquisition Pipeline (KAP)\*\*.



The Knowledge Acquisition Pipeline is the exclusive mechanism through which knowledge assets enter the operating system.



All knowledge assets SHALL be normalized into a common internal representation before interacting with any core GH-AIOS service.



\---



\# Responsibilities



The Knowledge Acquisition Pipeline SHALL be responsible for:



\- Discovering knowledge assets.

\- Selecting the correct acquisition adapter.

\- Reading the source content.

\- Normalizing knowledge assets into a common internal structure.

\- Extracting registration metadata.

\- Registering the source through the Knowledge Source Registry Executor.

\- Receiving the permanent Source UUID.

\- Forwarding registered assets to the Document Processing Pipeline.



\---



\# Explicit Non-Responsibilities



The Knowledge Acquisition Pipeline SHALL NOT:



\- Chunk documents.

\- Generate embeddings.

\- Store vectors.

\- Validate source trustworthiness.

\- Activate knowledge sources.

\- Modify database records directly.

\- Perform semantic indexing.

\- Perform retrieval.



These responsibilities belong to dedicated downstream services.



\---



\# Adapter Architecture



Every supported source type SHALL have its own acquisition adapter.



Examples include:



\- Markdown Adapter

\- PDF Adapter

\- DOCX Adapter

\- Website Adapter

\- RSS Adapter

\- API Adapter

\- GitHub Adapter

\- Google Docs Adapter



Adapters may differ internally, but every adapter SHALL output the same normalized knowledge asset.



\---



\# Normalized Knowledge Asset



Every adapter SHALL produce an object following the same logical structure.



Example:



```json

{

&#x20; "asset\_title": "",

&#x20; "asset\_content": "",

&#x20; "asset\_type": "",

&#x20; "mime\_type": "",

&#x20; "path": "",

&#x20; "metadata": {}

}

```



Downstream services SHALL never depend on the original source format.



\---



\# Interaction with KSR



The Knowledge Acquisition Pipeline SHALL communicate with the Knowledge Source Registry exclusively through the \*\*KSR Executor\*\*.



The pipeline SHALL NOT perform direct SQL operations.



Registration requests SHALL follow the Executor contract.



Example:



```json

{

&#x20; "operation": "REGISTER\_SOURCE",

&#x20; "payload": {

&#x20;   "...": "..."

&#x20; }

}

```



The Executor returns the permanent Source UUID.



\---



\# Interaction with Document Processing



Once a source has been successfully registered, the normalized knowledge asset SHALL be forwarded to the Document Processing Pipeline.



The Document Processor becomes responsible for:



\- Document retrieval

\- Chunk generation

\- Embedding generation

\- Vector storage

\- Processing status updates



\---



\# Architectural Flow



```

Knowledge Source

&#x20;       │

&#x20;       ▼

Source Adapter

&#x20;       │

&#x20;       ▼

Normalize Knowledge Asset

&#x20;       │

&#x20;       ▼

Extract Metadata

&#x20;       │

&#x20;       ▼

KSR Executor

&#x20;       │

&#x20;       ▼

Knowledge Source Registry

&#x20;       │

&#x20;       ▼

Document Processing Pipeline

```



\---



\# Benefits



This architecture provides:



\- A single entry point for knowledge acquisition.

\- Clear separation of responsibilities.

\- Extensible adapter architecture.

\- Stable service boundaries.

\- Simplified testing.

\- Consistent metadata generation.

\- Reduced duplication.

\- Future compatibility with additional source types.



\---



\# Consequences



All future ingestion workflows MUST comply with this ADR.



New source types SHALL be introduced by implementing additional adapters rather than modifying downstream services.



Changes to the acquisition architecture SHALL require a new ADR.



\---



\*\*Approved by\*\*



Greenhouse Futures Lab



Greenhouse AI Operating System (GH-AIOS)



Version 1.0

