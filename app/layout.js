import { Inter, Black_Ops_One } from "next/font/google";
import "./globals.css";
import Navigation from "@/app/_components/Navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const blackOpsOne = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-black-ops",
});

export const metadata = {
  title: "LOL MAD MOVIE",
  description: "칼바람 하이라이트 아카이브",
  openGraph: {
    title: "LOL MAD MOVIE",
    description: "칼바람 하이라이트",
    siteName: "LOL MAD MOVIE",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${inter.variable} ${blackOpsOne.variable}`}>
      <body className={inter.className}>
        <Navigation />
        <main className="mx-auto min-h-screen flex flex-col items-center">{children}</main>
      </body>
    </html>
  );
}
