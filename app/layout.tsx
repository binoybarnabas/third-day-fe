import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google"; // Import the fonts used in your original HTML
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

// 1. Define custom fonts using Next.js Font Optimization (replacing <link> tags)
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// 2. Define Metadata (replacing <title> and <meta> tags)
export const metadata: Metadata = {
  // <title> and standard <meta name="description">
  title: "STREET • WEAR | Modern Fashion Store",
  description: "Curated streetwear for the modern generation. Shop the latest trends in men's and women's fashion.",
  
  // <link rel="icon">
  icons: {
    icon: '/favicon.png', // Assuming this is in the public directory
  },

  // Open Graph (og:) metadata
  // openGraph: {
  //   title: "STREET • WEAR | Modern Fashion Store",
  //   description: "Curated streetwear for the modern generation. Shop the latest trends in men's and women's fashion.",
  //   type: "website",
  //   url: "https://your-domain.com", // Add your actual URL here
  //   images: [
  //     {
  //       url: "/attached_assets/generated_images/hero-banner.png", // Assuming this is reachable in public/attached_assets/...
  //       alt: "STREET • WEAR Hero Banner",
  //     },
  //   ],
  // },

  // // Twitter metadata
  // twitter: {
  //   card: "summary_large_image",
  //   site: "@replit", // Retaining your original site handle
  //   title: "STREET • WEAR | Modern Fashion Store",
  //   description: "Curated streetwear for the modern generation. Shop the latest trends in men's and women's fashion.",
  //   images: [
  //     "/attached_assets/generated_images/hero-banner.png",
  //   ],
  // },
};


// 3. RootLayout Component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Set lang and custom class for font variables
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
        // You can add the max-scale=1 viewport setting to the body class or a custom viewport meta tag if needed,
        // but Next.js handles most viewport settings automatically.
      >
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}