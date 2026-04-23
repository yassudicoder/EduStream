import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduStream — ELI5 Learning Platform",
  description: "Explain any concept like you're 5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Mesh gradient background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/30 blur-[120px]" />
          <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600/25 blur-[120px]" />
          <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute inset-0 bg-[#0f0f1a]/60" />
        </div>
        {children}
      </body>
    </html>
  );
}
