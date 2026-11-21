
import { useEffect, useState } from "react";
import "./App.css";

const GATEWAY_URL = "/api/gateway";

type GatewayResponse = {
  answer?: string;
  response?: string;
  output?: string;
  message?: string;
  error?: string;
  [key: string]: unknown;
};

type HistoryItem = {
  id: string;
  prompt: string;
  response: string;
  timestamp: string;
};

const HISTORY_STORAGE_KEY = "gh-aios-history";
const SAVED_STORAGE_KEY = "gh-aios-saved";

function getStoredItems<T>(key: string): T[] {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T[]) : [];
  } catch {
    return [];
  }
}

function getResponseText(data: GatewayResponse | string): string {
  if (typeof data === "string") return data;

  const candidate =
    data.answer ??
    data.response ??
    data.output ??
    data.message;

  if (typeof candidate === "string") return candidate;

  return JSON.stringify(data, null, 2);
}

function App() {
  const [requestText, setRequestText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [history, setHistory] = useState<HistoryItem[]>(
    () => getStoredItems<HistoryItem>(HISTORY_STORAGE_KEY)
  );

  const [savedItems, setSavedItems] = useState<HistoryItem[]>(
    () => getStoredItems<HistoryItem>(SAVED_STORAGE_KEY)
  );

  const [activeView, setActiveView] = useState<"workspace" | "history" | "saved">(
    "workspace"
  );

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Local browser storage may be unavailable or full.
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedItems));
    } catch {
      // Local browser storage may be unavailable or full.
    }
  }, [savedItems]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = requestText.trim();
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setErrorText("");
    setResponseText("");

    try {
      const response = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userRequest: prompt,
        }),
      });

      const rawBody = await response.text();

      let data: GatewayResponse | string;
      try {
        data = JSON.parse(rawBody) as GatewayResponse;
      } catch {
        data = rawBody;
      }

      if (!response.ok) {
        const message =
          typeof data === "object" && data !== null && "error" in data
            ? String(data.error)
            : `Gateway request failed with status ${response.status}.`;

        throw new Error(message);
      }

      const answer = getResponseText(data);
      setResponseText(answer);

      const item: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        prompt,
        response: answer,
        timestamp: new Date().toISOString(),
      };

      setHistory((previous) => [item, ...previous].slice(0, 100));
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while contacting the gateway."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewRequest() {
    setRequestText("");
    setResponseText("");
    setErrorText("");
    setActiveView("workspace");
  }

  function handleLoadHistory(item: HistoryItem) {
    setRequestText(item.prompt);
    setResponseText(item.response);
    setErrorText("");
    setActiveView("workspace");
  }

  function handleSaveCurrentResponse() {
    if (!requestText.trim() || !responseText.trim()) return;

    const existing = savedItems.some(
      (item) =>
        item.prompt === requestText.trim() &&
        item.response === responseText
    );

    if (existing) return;

    const item: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      prompt: requestText.trim(),
      response: responseText,
      timestamp: new Date().toISOString(),
    };

    setSavedItems((previous) => [item, ...previous].slice(0, 100));
  }

  function handleRemoveHistory(id: string) {
    setHistory((previous) => previous.filter((item) => item.id !== id));
  }

  function handleRemoveSaved(id: string) {
    setSavedItems((previous) => previous.filter((item) => item.id !== id));
  }

  function handleCopyResponse() {
    if (!responseText) return;

    void navigator.clipboard
      .writeText(responseText)
      .catch(() => setErrorText("Unable to copy the response to the clipboard."));
  }

  const activeItems =
    activeView === "history" ? history : savedItems;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">G</div>
          <div>
            <div className="brand-name">GREENHOUSE</div>
            <div className="brand-subtitle">AI OPERATING SYSTEM</div>
          </div>
        </div>

        <button
          className={`nav-item ${activeView === "workspace" ? "active" : ""}`}
          onClick={() => setActiveView("workspace")}
          type="button"
        >
          <span className="nav-icon">⌂</span>
          Workspace
        </button>

        <button
          className={`nav-item ${activeView === "history" ? "active" : ""}`}
          onClick={() => setActiveView("history")}
          type="button"
        >
          <span className="nav-icon">◷</span>
          History
          <span className="nav-count">{history.length}</span>
        </button>

        <button
          className={`nav-item ${activeView === "saved" ? "active" : ""}`}
          onClick={() => setActiveView("saved")}
          type="button"
        >
          <span className="nav-icon">☆</span>
          Saved responses
          <span className="nav-count">{savedItems.length}</span>
        </button>

        <div className="sidebar-spacer" />

        <div className="sidebar-footer">
          <div className="status-dot" />
          <div>
            <div className="footer-status">Development environment</div>
            <div className="footer-caption">Local workspace</div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="eyebrow">GREENHOUSE EFFECT INITIATIVE</div>
            <h1>
              {activeView === "workspace"
                ? "AI Workspace"
                : activeView === "history"
                  ? "Request History"
                  : "Saved Responses"}
            </h1>
          </div>

          <button
            className="secondary-button"
            onClick={handleNewRequest}
            type="button"
          >
            + New request
          </button>
        </header>

        {activeView === "workspace" ? (
          <div className="workspace">
            <section className="welcome-panel">
              <div className="welcome-copy">
                <div className="eyebrow">YOUR ORGANISATIONAL INTELLIGENCE LAYER</div>
                <h2>What would you like to work on?</h2>
                <p>
                  Ask a question, explore organisational knowledge, or work
                  through a task using the Greenhouse AI-OS gateway.
                </p>
              </div>
              <div className="welcome-symbol" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </section>

            <section className="request-panel">
              <div className="section-heading">
                <div>
                  <h3>New request</h3>
                  <p>Describe the outcome you need.</p>
                </div>
                <span className="panel-label">AI GATEWAY</span>
              </div>

              <form onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="request-input">
                  Enter your request
                </label>
                <textarea
                  id="request-input"
                  value={requestText}
                  onChange={(event) => setRequestText(event.target.value)}
                  placeholder="Ask about a programme, retrieve organisational knowledge, or describe a task..."
                  rows={5}
                  disabled={isLoading}
                />

                <div className="composer-footer">
                  <span className="helper-text">
                    Responses depend on available knowledge and connected services.
                  </span>
                  <button
                    className="primary-button"
                    type="submit"
                    disabled={!requestText.trim() || isLoading}
                  >
                    {isLoading ? "Working..." : "Submit request"}
                    {!isLoading && <span aria-hidden="true"> →</span>}
                  </button>
                </div>
              </form>
            </section>

            {errorText && (
              <section className="feedback-panel error-panel" role="alert">
                <h3>Request could not be completed</h3>
                <p>{errorText}</p>
                <p className="helper-text">
                  Check that the gateway is running and that its webhook
                  configuration matches this UI.
                </p>
              </section>
            )}

            {(isLoading || responseText) && (
              <section className="response-panel">
                <div className="section-heading">
                  <div>
                    <h3>Response</h3>
                    <p>
                      {isLoading
                        ? "Waiting for the gateway..."
                        : "The gateway returned a response."}
                    </p>
                  </div>

                  {responseText && (
                    <div className="response-actions">
                      <button
                        className="small-button"
                        onClick={handleCopyResponse}
                        type="button"
                      >
                        Copy
                      </button>
                      <button
                        className="small-button"
                        onClick={handleSaveCurrentResponse}
                        type="button"
                      >
                        ☆ Save
                      </button>
                    </div>
                  )}
                </div>

                {isLoading ? (
                  <div className="loading-state">
                    <div className="loading-indicator" />
                    <span>Processing your request</span>
                  </div>
                ) : (
                  <div className="response-content">{responseText}</div>
                )}
              </section>
            )}

            <section className="info-grid">
              <article className="info-card">
                <div className="info-icon">⌘</div>
                <h3>Organisational context</h3>
                <p>
                  Connect requests to the knowledge and workflows made
                  available through the gateway.
                </p>
              </article>

              <article className="info-card">
                <div className="info-icon">↗</div>
                <h3>Workflow integration</h3>
                <p>
                  The gateway can connect the interface to configured
                  automation and AI services.
                </p>
              </article>

              <article className="info-card">
                <div className="info-icon">◇</div>
                <h3>Controlled deployment</h3>
                <p>
                  Prepare authentication, access controls, and service
                  boundaries before public deployment.
                </p>
              </article>
            </section>
          </div>
        ) : (
          <section className="list-panel">
            <div className="section-heading">
              <div>
                <h3>
                  {activeView === "history"
                    ? "Recent requests"
                    : "Your saved responses"}
                </h3>
                <p>
                  {activeView === "history"
                    ? "Stored in this browser."
                    : "Responses you chose to keep in this browser."}
                </p>
              </div>
            </div>

            {activeItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  {activeView === "history" ? "◷" : "☆"}
                </div>
                <h3>
                  {activeView === "history"
                    ? "No requests yet"
                    : "No saved responses yet"}
                </h3>
                <p>
                  {activeView === "history"
                    ? "Your completed requests will appear here."
                    : "Submit a request and save its response to find it here."}
                </p>
                <button
                  className="primary-button"
                  onClick={() => setActiveView("workspace")}
                  type="button"
                >
                  Go to workspace →
                </button>
              </div>
            ) : (
              <div className="history-list">
                {activeItems.map((item) => (
                  <article className="history-item" key={item.id}>
                    <div className="history-item-main">
                      <div className="history-date">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                      <h3>{item.prompt}</h3>
                      <p>{item.response}</p>
                    </div>

                    <div className="history-item-actions">
                      <button
                        className="small-button"
                        onClick={() => handleLoadHistory(item)}
                        type="button"
                      >
                        Open
                      </button>
                      <button
                        className="small-button danger-button"
                        onClick={() =>
                          activeView === "history"
                            ? handleRemoveHistory(item.id)
                            : handleRemoveSaved(item.id)
                        }
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        <footer className="main-footer">
          <span>GREENHOUSE AI-OS</span>
          <span>Organisational intelligence · Knowledge · Workflows</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
