import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tetris",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const linkList = ["Tetris", "Flappy Bird"];
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col items-center`}>
        <div className="flex gap-x-2 p-4">
          {linkList.map((link, index) => (
            <Link
              className="border px-2 py-1"
              href={link.toLowerCase().replace(" ", "")}
              key={index}
            >
              {link}
            </Link>
          ))}
        </div>
        <div>{children}</div>
      </body>
    </html>
  );
}
