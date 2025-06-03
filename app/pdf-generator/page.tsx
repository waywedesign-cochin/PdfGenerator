// "use client";

// import { useState } from "react";
// import React from "react";
// import { generateUserPDF } from "../actions/generate-pdf";

// export default function PDFGeneratorPage() {
//   const [userId, setUserId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleGenerate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!userId || isNaN(Number(userId))) {
//       setError("Enter valid ID (1-10)");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     // try {
//     //   // const res = await fetch(`/api/generate-pdf/${userId}`);
//     //   const res = await generateUserPDF(userId);
//     //   if (!res.ok) {
//     //     const data = await res.json();
//     //     throw new Error(data.error || "Failed to download");
//     //   }

//     //   // Create a Blob from the response and generate a download link for the PDF
//     //   const blob = await res.blob(); // Convert the response to a Blob
//     //   const url = URL.createObjectURL(blob); // Create a URL for the Blob
//     //   const a = document.createElement("a"); // Create an anchor element
//     //   a.href = url;
//     //   a.download = `user-${userId}-report.pdf`;
//     //   a.click();
//     //   URL.revokeObjectURL(url);
//     // } catch (err) {
//     //   console.error(err);
//     //   setError("Failed to generate PDF");
//     // } finally {
//     //   setLoading(false);
//     // }
//     try {
//       // Get the base64 PDF data from the server action
//       const pdfBase64 = await generateUserPDF(userId);

//       // Convert base64 to Blob
//       const byteCharacters = atob(pdfBase64);
//       const byteNumbers = new Array(byteCharacters.length);
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }
//       const byteArray = new Uint8Array(byteNumbers);
//       const blob = new Blob([byteArray], { type: "application/pdf" });

//       // Create download link
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `user-${userId}-report.pdf`;
//       document.body.appendChild(a);
//       a.click();

//       // Clean up
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to generate PDF");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-4 border shadow rounded">
//       <h2 className="text-xl font-bold mb-4">Generate User PDF</h2>
//       <form onSubmit={handleGenerate}>
//         <input
//           type="number"
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//           placeholder="Enter user ID (1-10)"
//           className="border px-2 py-1 w-full mb-2"
//         />
//         {error && <p className="text-red-500 mb-2">{error}</p>}
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           {loading ? "Generating..." : "Download PDF"}
//         </button>
//       </form>
//     </div>
//   );
// }
// app/components/PDFGenerator.tsx
// app/components/PDFGeneratorPage.tsx
"use client";

import { useState } from "react";
import { generateUserPDF } from "@/app/actions/pdf"; // Import the Server Action

export default function PDFGeneratorPage() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation (optional, since the Server Action also validates)
    if (
      !userId ||
      isNaN(Number(userId)) ||
      Number(userId) < 1 ||
      Number(userId) > 10
    ) {
      setError("Enter valid ID (1-10)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the Server Action
      const result = await generateUserPDF(userId);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Convert base64 to Blob
      const byteCharacters = atob(result.buffer || "");
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename || `user-${userId}-report.pdf`;
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to generate PDF");
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
          min="1"
          max="10"
          className="border px-2 py-1 w-full mb-2"
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Generating..." : "Download PDF"}
        </button>
      </form>
    </div>
  );
}
