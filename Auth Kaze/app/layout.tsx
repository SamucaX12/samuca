import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kaze Auth - Plataforma Profissional',
  description: 'A infraestrutura definitiva para gerenciar licenças, usuários e integrações.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-height-screen bg-black text-[#f5f5f7] antialiased">
        {children}
      </body>
    </html>
  );
}
