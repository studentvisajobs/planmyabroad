"use client";

import { useState } from "react";

type AiAssistantSuccess = {
  ok: true;
  data: {
    answer: string;
    premium: boolean;
    profileComplete: boolean;
  };
};

type AiAssistantError = {
  ok: false;
  error: {
    code:
      | "UNAUTHORIZED"
      | "QUESTION_REQUIRED"
      | "PROFILE_MISSING"
      | "OPENAI_KEY_MISSING"
      | "AI_ASSISTANT_FAILED";
    message: string;
  };
};

type AiAssistantResponse = AiAssistantSuccess | AiAssistantError;

export default function AssistantPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [premium, setPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askAssistant(e: React.FormEvent) {
    e.preventDefault();

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnswer("");

      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
        }),
      });

      const text = await res.text();

      let data: AiAssistantResponse;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!data.ok) {
        throw new Error(data.error.message || "Failed to get assistant response");
      }

      setAnswer(data.data.answer);
      setPremium(data.data.premium);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="mt-2 text-gray-600">
            Ask practical migration questions based on your profile and country rules.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <form onSubmit={askAssistant} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Your question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Example: Which country is best for me right now and what should I improve first?"
                className="min-h-[140px] w-full rounded-xl border p-4 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Thinking..." : "Ask AI Assistant"}
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {answer && (
          <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Assistant Answer</h2>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  premium
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {premium ? "Premium Response" : "Free Response"}
              </span>
            </div>

            <div className="whitespace-pre-wrap text-sm leading-7 text-gray-800">
              {answer}
            </div>
          </div>
        )}

        {!premium && answer && (
          <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
            <h3 className="text-lg font-bold text-yellow-900">
              Unlock Premium AI Assistant
            </h3>
            <p className="mt-2 text-sm text-yellow-800">
              Premium gives deeper reasoning, better route guidance, and more strategic
              migration advice.
            </p>
            <div className="mt-4">
              <a
                href="/premium"
                className="inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
              >
                Upgrade to Premium
              </a>
            </div>
          </div>
        )}

        {premium && answer && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">
            <h3 className="text-lg font-bold text-green-900">
              Premium AI Assistant Active
            </h3>
            <p className="mt-2 text-sm text-green-800">
              You’re seeing the full premium version of the AI Assistant response.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}