import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Extract Image to Text",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/favicon-32x32.png",
  },
  description: "Extract handwritten text from images using Ollama Vision",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        
      </head>
      <body className={`bg-white ${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
