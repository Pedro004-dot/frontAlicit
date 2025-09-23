import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para Vercel
  output: 'standalone',
  // Se você estiver usando imagens, pode precisar configurar:
  // images: {
  //   unoptimized: true
  // }
};

export default nextConfig;
