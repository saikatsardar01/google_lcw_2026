import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Google Learn with Communities | Leaderboard",
  description:
    "Track your Google Skills badges, achievements and community leaderboard rankings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}