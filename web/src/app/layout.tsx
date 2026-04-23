import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NetworkProvider } from "@/contexts/NetworkContext";
import { WalletProvider } from "@/components/WalletProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TimeVault - Crypto Inheritance & Deadman Switch",
  description:
    "Secure automated inheritance for your digital assets on Solana.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <NetworkProvider>
          <WalletProvider>
            {children}
            <Toaster position="top-right" richColors />
          </WalletProvider>
        </NetworkProvider>
      </body>
    </html>
  );
}
 
