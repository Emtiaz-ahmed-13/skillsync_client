import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import SessionProviderWrapper from "../components/session-provider-wrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkillSync - Professional Collaboration Hub",
  description:
    "A centralized platform for freelancers and clients to collaborate efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
