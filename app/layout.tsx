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
    <html lang="en" className="h-full bg-white">
      <body className="min-h-full bg-white text-black antialiased">
        {children}
      </body>
    </html>
  );
}

