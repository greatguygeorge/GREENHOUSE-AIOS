\# GH-AIOS Design Note



\# Observation: Web Knowledge Ingestion Quality



Date:

2026-07-29



\---



\## Background



During the development of the Knowledge Source Registry (KSR), we inspected the existing greenhouse\_knowledge\_base table and discovered that a NASA webpage had previously been ingested.



Although the ingestion process successfully:



\- Retrieved the webpage

\- Chunked the content

\- Generated embeddings

\- Stored the vectors



…the resulting knowledge was not useful.



The stored chunks primarily contained:



\- Navigation menus

\- Search bar content

\- Footer links

\- Header elements

\- NASA+ references

\- General website structure



instead of the actual article content.



\---



\# Key Observation



The issue is not the source itself.



The issue is the current Knowledge Acquisition Service (KAS) web ingestion pipeline.



At present, the workflow effectively performs:



Website



↓



Download HTML



↓



Chunk entire page



↓



Generate embeddings



↓



Store vectors



This results in unnecessary, low-value knowledge entering the vector database.



\---



\# Recommended Architecture



The web ingestion pipeline should evolve into:



Website



↓



Download HTML



↓



Extract Main Content



↓



Remove Navigation



↓



Remove Header



↓



Remove Footer



↓



Remove Cookie Banners



↓



Remove Advertisements



↓



Remove Sidebars



↓



Remove Scripts



↓



Remove Social Links



↓



Content Quality Validation



↓



Chunk



↓



Generate Embeddings



↓



Store in Knowledge Base



\---



\# Benefits



This improvement will:



\- Increase retrieval accuracy

\- Reduce irrelevant vector storage

\- Improve semantic search quality

\- Reduce token usage

\- Improve response relevance

\- Increase trustworthiness of retrieved knowledge



\---



\# Design Principle



The Knowledge Base should contain:



\- Articles

\- Reports

\- Research

\- Policies

\- Guides

\- Structured documentation



The Knowledge Base should NOT contain:



\- Website menus

\- Navigation

\- Search bars

\- Cookie notices

\- Footer links

\- Social media buttons

\- UI components

\- Decorative website text



\---



\# Relationship to KSR



This observation also reinforces the purpose of the Knowledge Source Registry.



The KSR should only register intentional, trusted knowledge sources.



A successful crawl does not automatically qualify a source for registration.



Sources should first pass:



\- Relevance review

\- Content quality checks

\- Validation

\- Trust assessment



before becoming managed knowledge sources inside GH-AIOS.



\---



\# Future Enhancement



Introduce a dedicated Web Content Extraction component inside the Knowledge Acquisition Service.



Possible technologies to evaluate:



\- Mozilla Readability

\- Trafilatura

\- Newspaper3k

\- JusText

\- BoilerPy3

\- Custom DOM extraction rules

\- AI-assisted content extraction



The selected extractor should isolate meaningful content before chunking and embedding.



\---



\# Conclusion



The NASA ingestion served as a successful proof that the web ingestion pipeline functions technically.



However, it also revealed that content quality is more important than content quantity.



Improving content extraction before embedding should be treated as a high-priority enhancement for the Knowledge Acquisition Service before expanding the number of registered external knowledge sources.



\---



Status



Deferred for future implementation after completion of:



\- Knowledge Source Registry (KSR)

\- Knowledge Retrieval Service (KRS)

\- Initial User Interface



Priority:

High

