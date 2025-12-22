// frontend/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },

  images: {
    domains: [
      'www.iport.ru',
      'cdn.iport.ru',
      'localhost',
      // добавьте другие домены, если нужно
    ],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.iport.ru', // Все поддомены iport.ru
      },
      {
        protocol: 'https',
        hostname: 'iport.ru',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**', // Разрешает все домены (менее безопасно)
      },
    ],
  },
};

export default nextConfig;
