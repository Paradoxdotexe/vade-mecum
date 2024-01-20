import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";

const notoSans = Noto_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vade Mecum",
  description: "A universe-agnostic, hyper-generalized, d6-based RPG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={notoSans.className}>{children}</body>
    </html>
  );
}
