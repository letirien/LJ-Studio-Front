/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {}, // Active Turbopack sans erreur
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v5.airtableusercontent.com',
      },
    ],
    dangerouslyAllowSVG: true,
  },
  
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;