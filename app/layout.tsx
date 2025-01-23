import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import NextAuthProvider from "@/providers/NextAuthProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

export const metadata: Metadata = {
  title: "Auth.js Configurations",
  description: "Configurations for Auth.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}  antialiased`}>
        <NextAuthProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
