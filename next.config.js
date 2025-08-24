module.exports = {
  images: {
    domains: ['v5.airtableusercontent.com'], // Ajoute ce domaine ici
    dangerouslyAllowSVG: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config
  },
}