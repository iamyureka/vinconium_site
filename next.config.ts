import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
      {
        protocol: 'https',
        hostname: 'green-acute-bison-742.mypinata.cloud',
      }
    ],
  },
  // webpack: (config) => {
  //   config.externals.push("@sphereon/isomorphic-argon2");
  //   return config;
  // },
  serverExternalPackages: ["@sphereon/isomorphic-argon2"],
  experimental: {
    useWasmBinary: true
  }
};

export default nextConfig;
