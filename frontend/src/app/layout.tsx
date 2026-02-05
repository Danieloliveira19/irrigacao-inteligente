// frontend/src/app/layout.tsx
import "./globals.css";
import { Providers } from "@/lib/query/providers";
import { ToastProvider } from "@/components/ui/toast";

export const metadata = {
  title: "Sistema de Irrigação",
  description: "MVP — Next.js + FastAPI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <ToastProvider>{children}</ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
