"use client";

import { useState } from "react";
import Link from "next/link";

export default function InterviewQuizPage() {
  const questions = [
    {
      id: 1,
      q: "Does adding 'use client' to a file mean it is rendered ONLY in the user's browser?",
      options: [
        "Yes, it runs 100% on the client like standard Vite CSR.",
        "No, Next.js still pre-renders Client Components to static HTML on initial page load.",
        "Yes, but only if dynamic functions are not imported.",
      ],
      correct: 1,
      explanation: "Client Components still pre-render into HTML on the server during initial load for fast FCP. 'use client' declares an entry point into the client module graph, not that it skips server pre-rendering!",
    },
    {
      id: 2,
      q: "Why should you avoid using array index as a key (key={index}) in dynamic lists?",
      options: [
        "It is slower for the browser GPU to calculate.",
        "Array indices cause state mismatch and input corruption when items are prepended, deleted, or sorted.",
        "Next.js build fails automatically if key={index} is detected.",
      ],
      correct: 1,
      explanation: "Because if you prepend an item, the item at index 0 changes identity, causing React to associate old DOM state (like input text or checkbox check) with the wrong item!",
    },
    {
      id: 3,
      q: "What is the primary difference between useEffect() and a Server Component?",
      options: [
        "useEffect runs on both server and client; Server Components run only on client.",
        "useEffect NEVER runs on the server; Server Components run EXCLUSIVELY on the server.",
        "They are interchangeable depending on export const dynamic.",
      ],
      correct: 1,
      explanation: "useEffect() is an exclusively client-side hook executed after real DOM mounting. Server Components run purely in the Node.js server environment and never ship their JS to the client.",
    },
    {
      id: 4,
      q: "What causes a React Hydration Mismatch error?",
      options: [
        "Slow network latency causing packet timeouts.",
        "Server-rendered HTML differing from the initial client render tree (e.g. Math.random(), Date.now(), or window access).",
        "Having more than 5 Client Components on a single page.",
      ],
      correct: 1,
      explanation: "React expects the pre-rendered server DOM and the client's initial render pass to match character-for-character. If they diverge, React throws a hydration error and discards the server DOM node.",
    },
    {
      id: 5,
      q: "How does Streaming SSR with <Suspense> improve perceived performance?",
      options: [
        "It flushes the fast page shell immediately, streaming slow asynchronous chunks over the same connection when ready.",
        "It automatically converts all database queries to WebSockets.",
        "It caches the entire response permanently on the CDN.",
      ],
      correct: 0,
      explanation: "Streaming eliminates the 'All-or-Nothing' waterfall. The user sees the header and skeleton loaders in 20ms, and slow reviews or recommendations stream into place when the server finishes resolving them.",
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  function handleSelect(questionId, optionIndex) {
    if (showResults) return;
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIndex });
  }

  const score = Object.keys(selectedAnswers).reduce((acc, qId) => {
    const q = questions.find((item) => item.id === parseInt(qId));
    return q && selectedAnswers[qId] === q.correct ? acc + 1 : acc;
  }, 0);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={{ color: "var(--accent-blue)", fontSize: "0.9rem" }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "12px 0 6px" }}>
          Senior React & Next.js Rendering Architect Quiz
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Test your mastery of browser rendering, React Fiber, hydration, and Next.js 15 App Router architecture.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {questions.map((q, qIndex) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const isCorrect = selectedAnswers[q.id] === q.correct;

          return (
            <div key={q.id} className="demo-box" style={{ margin: 0, borderColor: showResults ? (isCorrect ? "var(--accent-green)" : "var(--accent-red)") : "var(--border-color)" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>
                {qIndex + 1}. {q.q}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {q.options.map((opt, optIndex) => {
                  const isSelected = selectedAnswers[q.id] === optIndex;
                  let bg = "var(--bg-secondary)";
                  let border = "var(--border-color)";

                  if (showResults) {
                    if (optIndex === q.correct) {
                      bg = "rgba(16, 185, 129, 0.15)";
                      border = "var(--accent-green)";
                    } else if (isSelected && !isCorrect) {
                      bg = "rgba(239, 68, 68, 0.15)";
                      border = "var(--accent-red)";
                    }
                  } else if (isSelected) {
                    bg = "rgba(59, 130, 246, 0.15)";
                    border = "var(--accent-blue)";
                  }

                  return (
                    <div
                      key={optIndex}
                      onClick={() => handleSelect(q.id, optIndex)}
                      style={{
                        padding: "12px 16px",
                        background: bg,
                        border: `1px solid ${border}`,
                        borderRadius: "8px",
                        cursor: showResults ? "default" : "pointer",
                        fontSize: "0.95rem",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>

              {showResults && (
                <div style={{ marginTop: "12px", padding: "10px 14px", background: "var(--bg-card)", borderRadius: "6px", fontSize: "0.85rem", color: "#d4d4d8" }}>
                  💡 <strong>Architectural Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {!showResults ? (
          <button
            onClick={() => setShowResults(true)}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            className="btn"
            style={{ padding: "12px 24px", fontSize: "1rem" }}
          >
            Submit Quiz & View Explanations
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <h3 style={{ fontSize: "1.2rem", color: score === questions.length ? "var(--accent-green)" : "var(--accent-amber)" }}>
              Final Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </h3>
            <button
              onClick={() => {
                setSelectedAnswers({});
                setShowResults(false);
              }}
              className="btn btn-secondary"
            >
              🔄 Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

