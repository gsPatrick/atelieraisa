/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permitir tanto o domínio de produção quanto localhost (com a porta)
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
        pathname: '/uploads/imagens/**',
      },
    ],
  },
};

export default nextConfig;
