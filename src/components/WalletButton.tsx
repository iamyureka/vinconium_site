'use client'

import { ConnectKitButton } from 'connectkit'
import { PixelButton } from './PixelButton'
import React from 'react'

export const WalletButton = () => {
    return (
        <ConnectKitButton.Custom>
            {({ isConnected, isConnecting, show, address, ensName }) => {
                const label = isConnected 
                    ? (ensName ?? `${address?.slice(0, 6)}...${address?.slice(-4)}`)
                    : 'CONNECT_WALLET';

                return (
                    <PixelButton 
                        variant={isConnected ? "neon" : "pink"} 
                        onClick={show}
                        className="text-[10px] py-2 px-4"
                    >
                        {isConnecting ? 'CONNECTING...' : label}
                    </PixelButton>
                );
            }}
        </ConnectKitButton.Custom>
    )
}
