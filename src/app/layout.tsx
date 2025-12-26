import "./globals.css"; // Isso corrige a tela branca sem estilo
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* O Providers aqui resolve o erro que apareceu na sua tela */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}