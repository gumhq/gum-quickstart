import { WalletContextProvider } from '@/contexts/WalletContextProvider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { useMemo } from 'react'
import GumSDKProvider from '@/components/GumSDKProvider'
import dotenv from 'dotenv'
import { GumUIProvider } from '@gumhq/ui-components'

dotenv.config()
// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');

export default function App({ Component, pageProps }: AppProps) {
  const cluster = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "devnet" | "mainnet-beta") || 'devnet';
  const network = useMemo(() => (cluster === 'mainnet-beta' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet), [cluster]);
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_ENDPOINT || clusterApiUrl(network);
  const wallets = useMemo(
      () => [
          new PhantomWalletAdapter(),
      ],
      [network]
  );

  return (
    <WalletContextProvider endpoint={endpoint} network={network} wallets={wallets} >
      <GumSDKProvider> 
        <GumUIProvider>
          <Component {...pageProps} />
        </GumUIProvider>
      </GumSDKProvider>
    </WalletContextProvider>
  )
}
