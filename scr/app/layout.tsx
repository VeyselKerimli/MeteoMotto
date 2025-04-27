import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MeteoMotto - Hava Durumu Uygulaması",
  description: "Modern ve kullanıcı dostu hava durumu uygulaması",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full">
      <body className={`${inter.className} h-full`}>
        <div className="flex flex-col min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
