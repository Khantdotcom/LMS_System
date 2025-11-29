import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "GIFT-Ed Platform",
    description: "Community Platform",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // REQUIRED: The root layout must contain html and body tags
        <html lang="en">
        {/* suppressHydrationWarning={true} is added here to stop the
        "Hydration Mismatch" error caused by your browser extensions
        injecting extra attributes into the body tag.
      */}
        <body className={inter.className} suppressHydrationWarning={true}>
        {children}
        </body>
        </html>
    );
}