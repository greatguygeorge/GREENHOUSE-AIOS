# GH-AIOS UI ↔ AI Gateway Contract v1

**Status:** Active Draft\
**Backend baseline:** GH-AIOS v1.2.0\
**UI branch:** `ui-v1`\
**Gateway endpoint:** `/webhook/gh-aisos/gateway`

------------------------------------------------------------------------

## 1. Purpose

This document defines the communication contract between the Greenhouse
AI-OS user interface and the AI Gateway.

The UI SHALL communicate exclusively with the AI Gateway.

The UI SHALL NOT directly invoke Knowledge Acquisition, Knowledge
Retrieval, specialist services, LLM providers, or internal n8n
workflows.

The AI Gateway is the UI-facing orchestration boundary.

------------------------------------------------------------------------

## 2. Architecture

``` text
GH-AIOS UI
    |
    | HTTP POST
    | JSON request
    v
AI Gateway
    |
    | Internal orchestration
    v
Knowledge / Specialist / LLM Services
    |
    | Result
    v
AI Gateway
    |
    | JSON response
    v
GH-AIOS UI
```

The UI only needs to know:

1.  The Gateway URL.
2.  The HTTP method.
3.  The request schema.
4.  The response schema.
5.  How to handle success and errors.

All internal service routing remains behind the Gateway.

------------------------------------------------------------------------

## 3. Gateway Endpoint

### 3.1 Method

``` http
POST
```

### 3.2 Path

Development:

``` text
/webhook-test/gh-aisos/gateway
```

Production:

``` text
/webhook/gh-aisos/gateway
```

The `/webhook-test/` URL is used while testing the n8n workflow.

The UI SHALL use the production `/webhook/` URL once the workflow is
activated for normal operation.

### 3.3 Development URL

When n8n is running locally:

``` text
http://localhost:5678/webhook-test/gh-aisos/gateway
```

### 3.4 Content Type

Requests SHALL use:

``` http
Content-Type: application/json
```

------------------------------------------------------------------------

## 4. Authentication

Authentication is not part of the current local development baseline.

For local development:

``` text
Authentication: None
```

Before public deployment, the Gateway SHALL be protected by an
authentication mechanism.

The UI contract SHOULD be designed so authentication can later be added
through an HTTP header without changing the request body.

Example future header:

``` http
Authorization: Bearer <token>
```

The UI SHALL NOT hard-code secrets into browser-side source code.

------------------------------------------------------------------------

## 5. Request Contract

The Gateway accepts a JSON object containing the user's request.

### 5.1 Request schema

``` json
{
  "userRequest": "string"
}
```

### 5.2 Example

``` json
{
  "userRequest": "Research the current climate festival landscape in Africa and identify five trends the Greenhouse Effect Festival should pay attention to."
}
```

### 5.3 Field definition

  --------------------------------------------------------------------------
  Field            Type                          Required Description
  ---------------- ---------------- --------------------- ------------------
  `userRequest`    string                             Yes Natural-language
                                                          instruction
                                                          submitted by the
                                                          user.

  --------------------------------------------------------------------------

### 5.4 Validation

The Gateway SHOULD reject requests when:

-   `userRequest` is missing.
-   `userRequest` is not a string.
-   `userRequest` is empty or contains only whitespace.
-   The request body is not valid JSON.

Example invalid request:

``` json
{
  "userRequest": ""
}
```

------------------------------------------------------------------------

## 6. Gateway Processing

After receiving a request, the Gateway is responsible for orchestration.

The UI SHALL NOT control internal routing.

A simplified processing flow is:

``` text
User Request
    |
    v
AI Gateway
    |
    +--> Determine task / intent
    |
    +--> Retrieve relevant knowledge when required
    |
    +--> Invoke specialist capability when required
    |
    +--> Invoke LLM reasoning / generation
    |
    +--> Assemble final response
    |
    v
Gateway Response
```

The internal implementation may evolve without requiring a UI contract
change, provided the external request and response contract remains
compatible.

------------------------------------------------------------------------

## 7. Knowledge Retrieval Boundary

The Gateway may use the Greenhouse AI-OS Knowledge Acquisition and
Knowledge Retrieval systems when a task requires grounded organizational
knowledge.

The UI SHALL NOT communicate directly with:

-   KAS ingestion workflows.
-   Knowledge Retrieval Service.
-   pgvector.
-   PostgreSQL.
-   Source-document storage.
-   Embedding services.
-   Internal knowledge APIs.

The Gateway is responsible for deciding whether knowledge retrieval is
required.

Example:

``` text
UI
 |
 | "Draft a sponsorship proposal for the Greenhouse Effect Festival."
 v
Gateway
 |
 +--> Retrieve relevant Greenhouse knowledge
 |
 +--> Generate proposal
 |
 v
UI
```

------------------------------------------------------------------------

## 8. LLM Boundary

The UI SHALL NOT directly call an LLM provider.

The Gateway owns the LLM interaction.

This keeps provider credentials, prompts, routing logic, model
selection, retrieval context, and orchestration logic outside the
browser.

The Gateway may change the underlying model or LLM provider without
requiring the UI to change.

------------------------------------------------------------------------

## 9. Response Contract

The current Gateway response is JSON.

### 9.1 Success response

``` json
{
  "success": true,
  "requestId": "3601",
  "response": "Generated response text"
}
```

### 9.2 Response fields

  ----------------------------------------------------------------------------
  Field            Type                          Required Description
  ---------------- ---------------- --------------------- --------------------
  `success`        boolean                            Yes Indicates whether
                                                          the Gateway
                                                          successfully
                                                          processed the
                                                          request.

  `requestId`      string                             Yes Identifier for the
                                                          Gateway
                                                          execution/request.

  `response`       string                  Yes on success Final response
                                                          generated by the
                                                          Gateway.
  ----------------------------------------------------------------------------

### 9.3 Example

``` json
{
  "success": true,
  "requestId": "3601",
  "response": "## Summary\nThe Greenhouse Effect Festival should pay attention to..."
}
```

The `response` field may contain Markdown.

The UI SHOULD render the returned Markdown as formatted content rather
than displaying the raw Markdown syntax.

------------------------------------------------------------------------

## 10. Request ID

Every successful Gateway request SHALL return a `requestId`.

Example:

``` json
{
  "success": true,
  "requestId": "3601",
  "response": "..."
}
```

The request ID exists to support:

-   Debugging.
-   Execution tracing.
-   Future observability.
-   Error investigation.
-   Linking UI activity to Gateway executions.

The UI SHOULD retain the `requestId` for the current request.

The UI SHOULD NOT expose internal execution identifiers unnecessarily to
the end user.

------------------------------------------------------------------------

## 11. Error Contract

The Gateway SHALL return a JSON response when a request cannot be
successfully processed.

Recommended structure:

``` json
{
  "success": false,
  "requestId": "3602",
  "error": {
    "code": "GATEWAY_ERROR",
    "message": "The request could not be processed."
  }
}
```

### 11.1 Error fields

  ---------------------------------------------------------------------------
  Field             Type                          Required Description
  ----------------- ---------------- --------------------- ------------------
  `success`         boolean                            Yes Must be `false`.

  `requestId`       string                     Recommended Identifier for the
                                                           failed request.

  `error`           object                             Yes Structured error
                                                           information.

  `error.code`      string                             Yes Machine-readable
                                                           error code.

  `error.message`   string                             Yes Human-readable
                                                           error message.
  ---------------------------------------------------------------------------

### 11.2 Example validation error

``` json
{
  "success": false,
  "requestId": "3603",
  "error": {
    "code": "INVALID_REQUEST",
    "message": "userRequest is required and must be a non-empty string."
  }
}
```

### 11.3 Example internal error

``` json
{
  "success": false,
  "requestId": "3604",
  "error": {
    "code": "GATEWAY_ERROR",
    "message": "The Gateway could not complete the request."
  }
}
```

The Gateway SHOULD NOT expose internal stack traces, database errors,
credentials, provider errors, or internal workflow details to the UI.

------------------------------------------------------------------------

## 12. HTTP Status Codes

The Gateway SHOULD use HTTP status codes consistently.

### Success

``` http
200 OK
```

### Invalid request

``` http
400 Bad Request
```

### Authentication failure

``` http
401 Unauthorized
```

### Forbidden request

``` http
403 Forbidden
```

### Not found

``` http
404 Not Found
```

### Rate limited

``` http
429 Too Many Requests
```

### Internal Gateway failure

``` http
500 Internal Server Error
```

The JSON response body SHOULD still follow the response/error structure
defined in this contract.

------------------------------------------------------------------------

## 13. UI Behaviour

The UI SHALL treat the Gateway as the single backend entry point for AI
operations.

For a normal request:

``` text
User enters request
        |
        v
UI sends POST request
        |
        v
Gateway processes request
        |
        v
UI receives JSON response
        |
        v
UI renders response
```

The UI SHOULD:

1.  Show a loading state while waiting.
2.  Disable duplicate submission where appropriate.
3.  Display the returned response.
4.  Preserve the request ID for debugging.
5.  Display a useful error state when the Gateway fails.
6.  Avoid exposing internal implementation details.

------------------------------------------------------------------------

## 14. UI Request Example

Browser-side request:

``` javascript
const response = await fetch(
  "http://localhost:5678/webhook/gh-aisos/gateway",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userRequest: "What should I prioritize when planning the Greenhouse Effect Festival?"
    })
  }
);

const data = await response.json();

if (data.success) {
  console.log(data.response);
} else {
  console.error(data.error);
}
```

For local n8n testing, the endpoint may temporarily be:

``` javascript
"http://localhost:5678/webhook-test/gh-aisos/gateway"
```

------------------------------------------------------------------------

## 15. Gateway Response Example for the UI

Example successful response:

``` json
{
  "success": true,
  "requestId": "3605",
  "response": "## Festival Priorities\n\n1. Build strong climate-community partnerships.\n2. Create a platform for African climate innovators.\n3. Connect climate action with jobs, health and economic opportunity."
}
```

The UI should render:

``` text
Festival Priorities

1. Build strong climate-community partnerships.
2. Create a platform for African climate innovators.
3. Connect climate action with jobs, health and economic opportunity.
```

------------------------------------------------------------------------

## 16. Markdown Responses

The Gateway may return Markdown in the `response` field.

Supported content may include:

-   Headings.
-   Paragraphs.
-   Bullet lists.
-   Numbered lists.
-   Bold text.
-   Italic text.
-   Links.
-   Code blocks.
-   Tables where appropriate.

The UI SHOULD use a Markdown renderer.

The Gateway SHOULD NOT return HTML intended to be inserted directly into
the DOM.

This reduces security risk and keeps presentation responsibility inside
the UI.

------------------------------------------------------------------------

## 17. Conversation Context

Version 1 accepts a single `userRequest`.

Current request:

``` json
{
  "userRequest": "Explain the Greenhouse Effect Festival."
}
```

Conversation history is not currently part of the public UI ↔ Gateway
contract.

Future versions MAY introduce:

``` json
{
  "userRequest": "Make that shorter.",
  "conversationId": "..."
}
```

Until that extension is formally adopted, the UI SHALL NOT depend on
`conversationId`.

------------------------------------------------------------------------

## 18. Request Metadata

Version 1 does not require the UI to send metadata.

Future versions MAY support metadata such as:

``` json
{
  "userRequest": "Create a sponsorship proposal.",
  "metadata": {
    "surface": "web",
    "locale": "en-NG"
  }
}
```

Any new request fields SHALL be introduced through a versioned contract
update.

The UI SHALL NOT invent undocumented Gateway fields.

------------------------------------------------------------------------

## 19. Security Requirements

The UI SHALL NOT contain:

-   LLM API keys.
-   Database passwords.
-   PostgreSQL credentials.
-   pgvector credentials.
-   n8n credentials.
-   Knowledge Retrieval credentials.
-   Specialist-service credentials.
-   Internal service URLs that are not required by the UI.

The browser communicates with the public Gateway boundary only.

Internal credentials remain server-side.

------------------------------------------------------------------------

## 20. CORS

When the UI and Gateway are hosted on different origins, the Gateway
deployment SHALL configure CORS appropriately.

Development may allow the local UI origin.

Production SHOULD use an explicit allow-list.

The Gateway SHOULD NOT use unrestricted wildcard CORS for authenticated
production traffic unless there is a documented reason.

------------------------------------------------------------------------

## 21. Timeout and Loading Behaviour

AI and retrieval operations may take longer than ordinary API requests.

The UI SHOULD:

-   Show an active loading state.
-   Prevent accidental duplicate requests.
-   Provide a clear failure message when the request times out.
-   Allow the user to retry where appropriate.

The UI SHOULD NOT assume that a slow request means the Gateway has
failed.

Future versions MAY introduce streaming responses for long-running
generations.

------------------------------------------------------------------------

## 22. Streaming

Streaming is not required for Contract v1.

The current contract returns a completed JSON response.

Future streaming support MAY use:

``` text
text/event-stream
```

or another explicitly versioned streaming protocol.

The UI SHALL NOT implement streaming assumptions until streaming is
formally added to the Gateway contract.

------------------------------------------------------------------------

## 23. Development Testing

The Gateway can be tested with cURL.

### Basic connectivity test

``` bash
curl -X POST "http://localhost:5678/webhook-test/gh-aisos/gateway" \
  -H "Content-Type: application/json" \
  -d '{"userRequest":"Test connection to the Greenhouse AI-OS Gateway API"}'
```

Expected response:

``` json
{
  "success": true,
  "requestId": "test",
  "response": "GH-AIOS Gateway API is connected."
}
```

### AI request test

``` bash
curl -X POST "http://localhost:5678/webhook-test/gh-aisos/gateway" \
  -H "Content-Type: application/json" \
  -d '{"userRequest":"Research the current climate festival landscape in Africa and identify five trends the Greenhouse Effect Festival should pay attention to."}'
```

Expected response shape:

``` json
{
  "success": true,
  "requestId": "3601",
  "response": "## Summary\n..."
}
```

The exact generated response is not part of the contract.

Only the response structure is contractual.

------------------------------------------------------------------------

## 24. Contract Compatibility

The following elements are considered stable for v1:

``` text
POST
JSON request
userRequest
success
requestId
response
```

The Gateway implementation may change internally without requiring a UI
rewrite.

The following are implementation details and SHALL remain behind the
Gateway:

``` text
n8n workflows
KAS
KRT
PostgreSQL
pgvector
embeddings
LLM providers
specialist services
internal routing
```

------------------------------------------------------------------------

## 25. Versioning

This document is Contract v1.

Current identifier:

``` text
GH-AIOS UI ↔ AI Gateway Contract v1
```

A breaking change SHALL result in a new contract version.

Examples of breaking changes:

-   Renaming `userRequest`.
-   Removing `response`.
-   Changing the response from JSON to an incompatible format.
-   Requiring a new mandatory request field.
-   Changing the Gateway authentication model in a way that breaks
    existing clients.

Non-breaking additions may be introduced carefully, provided existing v1
clients continue to work.

------------------------------------------------------------------------

## 26. Implementation Baseline

The current development Gateway has been successfully tested through the
n8n webhook.

Current development flow:

``` text
Webhook
   |
   v
Execute AI Gateway Callable v1
   |
   v
LLM / Gateway processing
   |
   v
Respond to Webhook
```

The Gateway has successfully accepted a natural-language `userRequest`
and returned a generated response through the HTTP endpoint.

This establishes the minimum working UI ↔ Gateway integration boundary.

------------------------------------------------------------------------

## 27. UI Implementation Rule

The UI team should build against this contract rather than against
individual n8n nodes.

The UI SHALL NOT depend on:

-   node names,
-   n8n execution IDs,
-   internal workflow topology,
-   internal node outputs,
-   KAS/KRT implementation details,
-   LLM provider response formats.

The UI depends only on the Gateway contract.

This separation allows the Greenhouse AI-OS backend to evolve without
repeatedly rewriting the UI.

------------------------------------------------------------------------

## 28. Future Extensions

The following capabilities may be added in later contract versions:

-   Authentication.
-   Conversation IDs.
-   User/session IDs.
-   Streaming.
-   Structured tool results.
-   Citations and knowledge sources.
-   File uploads.
-   Task execution status.
-   Long-running job IDs.
-   Feedback signals.
-   Model selection.
-   Agent/task execution requests.
-   Structured response blocks.
-   UI actions.
-   Permission-aware requests.

These SHALL be introduced through explicit contract versions rather than
silently changing v1.

------------------------------------------------------------------------

## 29. Contract Summary

### Request

``` json
{
  "userRequest": "User's natural-language request"
}
```

### Success response

``` json
{
  "success": true,
  "requestId": "request-id",
  "response": "Gateway-generated response"
}
```

### Error response

``` json
{
  "success": false,
  "requestId": "request-id",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Boundary

``` text
UI
 |
 | POST /webhook/gh-aisos/gateway
 v
AI Gateway
 |
 +--> KAS / KRT / Specialist Services / LLM
 |
 v
AI Gateway
 |
 | JSON
 v
UI
```

------------------------------------------------------------------------

## 30. Status

**Contract v1 is the working baseline for the Greenhouse AI-OS UI ↔ AI
Gateway integration.**

The Gateway has been tested with:

1.  A basic connectivity request.
2.  A content-generation request.
3.  A knowledge-oriented research request.

The next implementation work belongs behind this contract: strengthening
Gateway routing, retrieval, error handling, authentication, and
production deployment while keeping the UI boundary stable.
