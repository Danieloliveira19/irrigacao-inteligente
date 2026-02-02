import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/query/providers";

export const metadata: Metadata = {
  title: "Irrigação Inteligente",
  description: "Dashboard e gestão de irrigação inteligente (MVP).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
