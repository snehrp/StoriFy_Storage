import type { Metadata } from "next";
import { Poppins } from 'next/font/google'
import "./globals.css";
import dotenv from "dotenv"

dotenv.config();

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100' , '200' , '300' , '400' , '500' , '600' , '700' , '800' , '900'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: "StoriFy",
  description: "Only Storage solution that you need",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-poppins antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
