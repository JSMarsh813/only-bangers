import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UserProvider } from "./components/context-wrappers/UserInfo";
import Script from "next/script";
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
    "An app to easily filter through software developer resources so you can find the 'banger' resources you need!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-blue-800 text-black`}
        >
          <Script
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-EM6W1Z1X54"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
          >
            {/* this way we're not logging development clicks */}
            {`
           if (process.env.NODE_ENV === "production") {
             window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());
             gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
               page_path: window.location.pathname,
             });
           }
          `}
          </Script>
          <header>
            <NavBar />

            {children}
          </header>
          <footer className=""></footer>
        </body>
      </UserProvider>
    </html>
  );
}
