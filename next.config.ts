import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para Vercel
  trailingSlash: false,
  // Garantir que as rotas funcionem corretamente
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  }
};

export default nextConfig;