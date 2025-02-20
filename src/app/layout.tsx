import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TestProvider } from "./components/context-wrappers/text";
import "./globals.css";
import NavBar from "./components/navbar/NavBar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Only Bangers",
  description:
    "Your new best friend. An app to easily filter through software developer resources so you can find the 'banger' resources you need!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <TestProvider> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        <header>
          <NavBar />
        </header>
        {children}
        <footer className=""></footer>
      </body>
      {/* </TestProvider> */}
    </html>
  );
}
