// import { NextResponse } from "next/server";
// import puppeteer from "puppeteer";

// export async function GET(
//   _: Request,
//   { params }: { params: { userId: string } }
// ) {
//   try {
//     const userId = params.userId;

//     const [userRes, postsRes, photosRes] = await Promise.all([
//       fetch(`https://jsonplaceholder.typicode.com/users/${userId}`),
//       fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`),
//       fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${userId}`),
//     ]);

//     if (!userRes.ok) {
//       return new NextResponse(JSON.stringify({ error: "User not found" }), {
//         status: 404,
//       });
//     }

//     const user = await userRes.json();
//     const posts = await postsRes.json();
//     const photos = await photosRes.json();

//     // 🧾 Prepare HTML content for PDF
//     const html = `
//       <html>
//         <head>
//           <style>
//             body { font-family: sans-serif; padding: 20px; }
//             h1 { color: #333; }
//             ul { padding-left: 20px; }
//             li { margin-bottom: 8px; }
//             img { max-width: 100px; }
//           </style>
//         </head>
//         <body>
//           <h1>User Report: ${user.name}</h1>
//           <img src="${photos[0]?.url}" alt="User Photo" />
//           <p><strong>Email:</strong> ${user.email}</p>
//           <p><strong>Company:</strong> ${user.company.name}</p>
//           <h2>Posts</h2>
//           <ul>
//             ${posts
//               .slice(0, 5)
//               .map((post: { title: string }) => `<li>${post.title}</li>`)
//               .join("")}
//           </ul>
//         </body>
//       </html>
//     `;

//     // 🖨️ Generate PDF using Puppeteer
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });

//     await page.evaluate(async () => {
//       const imgs = Array.from(document.images);
//       await Promise.all(
//         imgs.map((img) => {
//           if (img.complete) return;
//           return new Promise((resolve, reject) => {
//             img.onload = resolve;
//             img.onerror = reject;
//           });
//         })
//       );
//     });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//     });

//     await browser.close();

//     const buffer = Buffer.from(pdfBuffer);
//     // 📄 Return actual PDF file
//     return new NextResponse(buffer, {
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="user-${userId}-report.pdf"`,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     return new NextResponse(
//       JSON.stringify({ error: "PDF generation failed" }),
//       {
//         status: 500,
//       }
//     );
//   }
// }
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

// Helper to generate SVG placeholder
const generatePlaceholderSVG = (text: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
      <rect width="150" height="150" fill="#f0f0f0"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" fill="#666">${text}</text>
    </svg>`
  )}`;
type Params = {
  userId: string;
};

export async function GET(_: Request, { params }: { params: Params }) {
  try {
    const userId = params.userId;

    const [userRes, postsRes, photosRes] = await Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/users/${userId}`),
      fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`),
      fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${userId}`),
    ]);

    if (!userRes.ok) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const user = await userRes.json();
    const posts = await postsRes.json();
    const photos = await photosRes.json();

    // Handle image - try to fetch or use SVG placeholder
    let imageSrc = generatePlaceholderSVG("User Photo");
    if (photos[0]?.url) {
      try {
        // const imageRes = await fetch(photos[0].url);
        const imageRes = await fetch(
          `https://picsum.photos/150?random=${userId}`,
          {
            headers: {
              "Content-Type": "image/jpeg",
            },
          }
        );
        if (imageRes.ok) {
          const imageBuffer = await imageRes.arrayBuffer();
          imageSrc = `data:image/jpeg;base64,${Buffer.from(
            imageBuffer
          ).toString("base64")}`;
        }
      } catch (err) {
        console.error("Image load failed, using placeholder:", err);
      }
    }

    // HTML content
    const html = `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body { 
              font-family: 'Inter', sans-serif; 
              line-height: 1.6;
              color: #1f2937;
              background: #ffffff;
              padding: 40px;
            }
            
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 12px;
              margin-bottom: 30px;
              text-align: center;
            }
            
            .header h1 {
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 8px;
            }
            
            .header p {
              font-size: 14px;
              opacity: 0.9;
            }
            
            .profile-section {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 25px;
              margin-bottom: 25px;
            }
            
            .section-title {
              font-size: 20px;
              font-weight: 600;
              color: #4f46e5;
              margin-bottom: 20px;
              border-bottom: 2px solid #e0e7ff;
              padding-bottom: 8px;
            }
            
            .user-info {
              display: grid;
              grid-template-columns: 200px 1fr;
              gap: 30px;
              align-items: start;
            }
            
            .user-photo {
              text-align: center;
            }
            
            .user-photo img {
              width: 150px;
              height: 150px;
              border-radius: 50%;
              border: 4px solid #e0e7ff;
              object-fit: cover;
            }
            
            .user-details {
              display: grid;
              gap: 12px;
            }
            
            .info-item {
              display: flex;
              align-items: center;
            }
            
            .info-label {
              font-weight: 600;
              color: #6b7280;
              min-width: 120px;
            }
            
            .info-value {
              color: #111827;
              font-weight: 400;
            }
            
            .posts-section {
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
              border: 1px solid #0ea5e9;
              border-radius: 12px;
              padding: 25px;
              margin-bottom: 25px;
            }
            
            .posts-list {
              list-style: none;
              padding: 0;
            }
            
            .posts-list li {
              background: white;
              padding: 15px;
              margin-bottom: 10px;
              border-radius: 8px;
              border-left: 4px solid #0ea5e9;
              font-weight: 500;
            }
            
            .company-section {
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              border: 1px solid #f59e0b;
              border-radius: 12px;
              padding: 25px;
              margin-bottom: 25px;
            }
            
            .footer {
              text-align: center;
              padding: 20px;
              border-top: 2px solid #e5e7eb;
              margin-top: 30px;
              color: #6b7280;
              font-size: 12px;
            }
            
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 60px;
              color: rgba(0, 0, 0, 0.05);
              font-weight: bold;
              z-index: -1;
              pointer-events: none;
            }
          </style>
        </head>
        <body>
          <div class="watermark">GENERATED REPORT</div>
          
          <div class="header">
            <h1>User Profile Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()} • User ID: ${userId}</p>
          </div>
          
          <div class="profile-section">
            <h2 class="section-title">👤 Personal Information</h2>
            <div class="user-info">
              <div class="user-photo">
                <img src="${imageSrc}" alt="User Photo" />
                <p style="margin-top: 10px; font-weight: 600; color: #4f46e5;">${
                  user.name
                }</p>
              </div>
              <div class="user-details">
                <div class="info-item">
                  <span class="info-label">Full Name:</span>
                  <span class="info-value">${user.name}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Username:</span>
                  <span class="info-value">@${user.username}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${user.email}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${user.phone}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Website:</span>
                  <span class="info-value">${user.website}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Address:</span>
                  <span class="info-value">${user.address.street}, ${
      user.address.city
    }</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="company-section">
            <h2 class="section-title">🏢 Company Information</h2>
            <div class="info-item">
              <span class="info-label">Company:</span>
              <span class="info-value">${user.company.name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Catchphrase:</span>
              <span class="info-value">"${user.company.catchPhrase}"</span>
            </div>
            <div class="info-item">
              <span class="info-label">Business:</span>
              <span class="info-value">${user.company.bs}</span>
            </div>
          </div>
          
          <div class="posts-section">
            <h2 class="section-title">📝 Recent Posts (${
              posts.length
            } total)</h2>
            <ul class="posts-list">
              ${posts
                .slice(0, 5)
                .map((post: { title: string }) => `<li>${post.title}</li>`)
                .join("")}
            </ul>
          </div>
          
          <div class="footer">
            <p><strong>Document Information</strong></p>
            <p>Generated on ${new Date().toLocaleString()} | User ID: ${userId}</p>
            <p>This document contains information fetched from JSONPlaceholder API</p>
          </div>
        </body>
      </html>
    `;

    // PDF generation
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });
    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="user-${userId}-report.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return new NextResponse(
      JSON.stringify({ error: "PDF generation failed" }),
      {
        status: 500,
      }
    );
  }
}
