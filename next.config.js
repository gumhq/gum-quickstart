const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['seeklogo.com'],
  },
  // webpack: (config, options) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     react: path.resolve(__dirname, ".", "node_modules", "react"),
  //     "react-dom": path.resolve(__dirname, ".", "node_modules", "react-dom"),
  //   };

  //   return config;
  // },
}

module.exports = nextConfig;
