// app/components/DownloadPDFButton.tsx
"use client";

import { generateUserPDF } from "@/app/actions/pdf";
import { useState } from "react";

export default function DownloadPDFButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateUserPDF(userId);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Convert base64 back to a buffer
      if (!result.buffer) {
        throw new Error("PDF buffer is missing.");
      }
      const byteCharacters = atob(result.buffer);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDownload} disabled={loading}>
        {loading ? "Generating..." : "Download PDF"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
