import DownloadPDFButton from "@/components/DownloadPDFButton";
import PDFGeneratorPage from "./pdf-generator/page";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4x  l sm:text-5xl font-bold">PDF Generator</h1>
      <PDFGeneratorPage />

      <DownloadPDFButton userId="1" />
    </div>
  );
}
