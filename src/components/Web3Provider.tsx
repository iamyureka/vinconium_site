'use client'

import React, { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { config } from '@/lib/web3'

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = React.useState(() => new QueryClient())
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider options={{ initialChainId: 80002 }}>
          {mounted ? children : null}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
