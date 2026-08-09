\# GH-AIOS UI ↔ AI Gateway Contract v1



\*\*Status:\*\* Draft  

\*\*Backend baseline:\*\* GH-AIOS v1.2.0  

\*\*UI branch:\*\* ui-v1



\---



\## 1. Purpose



This document defines the communication contract between the GH-AIOS user interface and the AI Gateway.



The UI SHALL communicate exclusively with the AI Gateway.



The UI SHALL NOT directly invoke specialist services.



\---



\## 2. Architecture



```text

GH-AIOS UI

&#x20;   │

&#x20;   │ User Request

&#x20;   ▼

AI Gateway

&#x20;   │

&#x20;   │ Internal Routing

&#x20;   ▼

Specialist Service

&#x20;   │

&#x20;   │ Result

&#x20;   ▼

AI Gateway

&#x20;   │

&#x20;   │ Response

&#x20;   ▼

GH-AIOS UI

