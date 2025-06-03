// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LayoutWrapper from "@/components/LayoutWrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import { WalletContextProvider } from "@/contexts/WalletContextProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tracui",
  description: "Bridging SUI Blockchain with embedded systems",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletContextProvider>
          <AuthProvider>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_CLIENT_ID_GOOGLE as string}
            >
              <LayoutWrapper>{children}</LayoutWrapper>
            </GoogleOAuthProvider>
          </AuthProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
