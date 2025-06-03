// app/actions/pdf.ts
"use server";

import { UserPDF } from "@/components/UserPDF";
import { renderToStream } from "@react-pdf/renderer";

export async function generateUserPDF(userId: string) {
  try {
    // Validate user ID
    if (
      !userId ||
      isNaN(Number(userId)) ||
      Number(userId) < 1 ||
      Number(userId) > 10
    ) {
      throw new Error("Invalid user ID. Must be between 1-10");
    }

    // Fetch from JSONPlaceholder
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    if (!res.ok) throw new Error("User not found");
    const user = await res.json();

    // Generate the PDF stream
    const stream = await renderToStream(UserPDF({ user, userId }));

    // Convert the stream to a buffer for easier client handling
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      // Ensure chunk is a Uint8Array
      if (typeof chunk === "string") {
        chunks.push(Buffer.from(chunk));
      } else {
        chunks.push(chunk);
      }
    }
    const buffer = Buffer.concat(chunks);

    // Return the buffer and metadata
    return {
      success: true,
      buffer: buffer.toString("base64"), // Convert to base64 for serialization
      filename: `user-${userId}-profile.pdf`,
    };
  } catch (error) {
    console.error("PDF generation failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate PDF",
    };
  }
}
