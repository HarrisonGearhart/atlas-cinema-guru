// app/layout.tsx
import "@/app/global.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cinema Guru | Atlas School",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#00003c] text-white">
        {children}
      </body>
    </html>
  );
}
