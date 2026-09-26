import { Geist, Geist_Mono, Figtree, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });

export const metadata = {
  title: "Career Dunes | Overseas Recruitment",
  description:
    "Connecting skilled Indian workers with verified international employers through transparent, responsible recruitment.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${figtree.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
