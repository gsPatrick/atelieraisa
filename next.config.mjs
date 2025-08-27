/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3045',
        pathname: '/uploads/imagens/**',
      },
      {
        protocol: 'https',
        hostname: 'n8n-doodledreamsbackend.r954jc.easypanel.host',
        pathname: '/**', // Permite qualquer caminho dentro desse domínio
      },
      {
        protocol: 'https',
        hostname: 'geral-ateliatania-api.r954jc.easypanel.host',
        pathname: '/**', // Permite qualquer caminho dentro desse domínio
      },
    ],
  },
};

export default nextConfig;
