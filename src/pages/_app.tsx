import { WalletContextProvider } from '@/contexts/WalletContextProvider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { GumUIProvider } from '@gumhq/ui-components'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter, SolflareWalletAdapter, SolletWalletAdapter, SolletExtensionWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { useMemo } from 'react'
import GumSDKProvider from '@/components/GumSDKProvider'

// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');

export default function App({ Component, pageProps }: AppProps) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
      () => [
          new PhantomWalletAdapter(),
          new SolflareWalletAdapter(),
          new SolletWalletAdapter({ network }),
          new SolletExtensionWalletAdapter({ network }),
          new TorusWalletAdapter(),
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
