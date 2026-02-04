import "./globals.css";
import { Providers } from "@/lib/query/providers";

export const metadata = {
  title: "Sistema de Irrigação",
  description: "MVP — Next.js + FastAPI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
