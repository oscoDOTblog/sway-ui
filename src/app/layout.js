import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://swayquest.vercel.app'),
  title: "swayDOTquest - Your One-Stop Shop for Becoming a Better Dancer",
  description: "swayDOTquest is your comprehensive platform for dance improvement. From beginner basics to advanced techniques, discover tools, tutorials, and resources to elevate your dance skills and confidence.",
  keywords: "dance, dance improvement, dance tutorials, dance skills, dance training, dance practice, dance education, dance community, dance resources, better dancer",
  authors: [{ name: "swayDOTquest Team" }],
  creator: "swayDOTquest",
  publisher: "swayDOTquest",
  robots: "index, follow",
  openGraph: {
    title: "swayDOTquest - Your One-Stop Shop for Becoming a Better Dancer",
    description: "swayDOTquest is your comprehensive platform for dance improvement. From beginner basics to advanced techniques, discover tools, tutorials, and resources to elevate your dance skills and confidence.",
    url: "https://swayquest.vercel.app",
    siteName: "swayDOTquest",
    images: [
      {
        url: "/bg/graffiti.jpg",
        width: 1200,
        height: 630,
        alt: "swayDOTquest - Your Journey to Becoming a Better Dancer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "swayDOTquest - Your One-Stop Shop for Becoming a Better Dancer",
    description: "swayDOTquest is your comprehensive platform for dance improvement. From beginner basics to advanced techniques, discover tools, tutorials, and resources to elevate your dance skills and confidence.",
    images: ["/bg/graffiti.jpg"],
    creator: "@swayquest",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
} 