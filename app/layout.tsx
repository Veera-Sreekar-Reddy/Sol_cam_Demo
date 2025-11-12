import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Advisor Chat",
  description:
    "Advising assistant interface inspired by AI chat apps, built with Next.js and Tailwind CSS."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-100">
      <body className="min-h-full bg-slate-100 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}

