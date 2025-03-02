import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { UserProvider } from "./components/context-wrappers/UserInfo";
import "./globals.css";
import NavBar from "./components/navbar/NavBar";
// import userDataFromServer from "../app/components/context-wrappers/dataForWrapper/userDataFromServer";
import { getUser } from "@/partials/auth";
import axios from "axios";
import conf from "../config/envConfig";

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
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
        >
          <header>
            {/* <span> {`User data ${JSON.stringify(ServerData)}`}</span> */}
            <NavBar />

            {children}
          </header>
          <footer className=""></footer>
        </body>
      </UserProvider>
    </html>
  );
}
