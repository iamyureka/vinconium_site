import { http, createConfig } from 'wagmi'
import { polygonAmoy } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [polygonAmoy],
    transports: {
      [polygonAmoy.id]: http('https://polygon-amoy.drpc.org'),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "2b7d5a2da89dd74fed821d184acabf95",

    // Required App Info
    appName: "Vinconium Shop",

    // SSR support
    ssr: true,

    // Optional App Info
    appDescription: "The Science Merchant - NFT Marketplace",
    appUrl: "https://vinconium.com", 
    appIcon: "https://family.co/logo.png", 
  }),
)
