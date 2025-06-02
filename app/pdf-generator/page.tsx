"use client";

import { useState } from "react";
import React from "react";

export default function PDFGeneratorPage() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || isNaN(Number(userId))) {
      setError("Enter valid ID (1-10)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/generate-pdf/${userId}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to download");
      }

      // Create a Blob from the response and generate a download link for the PDF
      const blob = await res.blob(); // Convert the response to a Blob
      const url = URL.createObjectURL(blob); // Create a URL for the Blob
      const a = document.createElement("a"); // Create an anchor element
      a.href = url;
      a.download = `user-${userId}-report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border shadow rounded">
      <h2 className="text-xl font-bold mb-4">Generate User PDF</h2>
      <form onSubmit={handleGenerate}>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID (1-10)"
          className="border px-2 py-1 w-full mb-2"
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Generating..." : "Download PDF"}
        </button>
      </form>
    </div>
  );
}
