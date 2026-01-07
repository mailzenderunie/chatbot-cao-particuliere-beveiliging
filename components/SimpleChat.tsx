"use client";

import { useState } from "react";

export default function SimpleChat() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const message = input.trim();
    if (!message) return;

    setLoading(true);
    setAnswer("");

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await r.json();

      if (!r.ok || !data.ok) {
        setAnswer("Er ging iets mis. Probeer het straks nog eens.");
        console.error("chat error", data);
      } else {
        setAnswer(data.text || "");
      }
    } catch (e) {
      console.error(e);
      setAnswer("Er ging iets mis met de verbinding.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="border rounded-xl p-4 bg-white">
        <label className="block text-sm font-medium mb-2">
          Stel je vraag over de cao
        </label>

        <textarea
          className="w-full border rounded-lg p-3 text-sm"
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Bijv. Wat is de proeftijd in de cao?"
        />

        <div className="mt-3 flex gap-2">
          <button
            className="px-4 py-2 rounded-lg text-white bg-sky-600 disabled:opacity-60"
            onClick={send}
            disabled={loading}
          >
            {loading ? "Even geduld..." : "Versturen"}
          </button>

          <button
            className="px-4 py-2 rounded-lg border"
            onClick={() => {
              setInput("");
              setAnswer("");
            }}
            disabled={loading}
          >
            Wissen
          </button>
        </div>

        {answer && (
          <div className="mt-4 border-t pt-4">
            <div className="text-sm whitespace-pre-wrap">{answer}</div>
          </div>
        )}
      </div>
    </div>
  );
}
