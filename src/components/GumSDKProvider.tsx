// The GumSDKProvider component initializes the Gum SDK and SessionKeyManager and provides it to its children via context.
// Wrap any component that needs access to the Gum SDK with this provider.

import { GumProvider, SessionWalletProvider, UploaderProvider, useSessionKeyManager } from '@gumhq/react-sdk';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useGumSDK } from '@/hooks/useGumSDK';

interface GumSDKProviderProps {
  children: React.ReactNode;
}

const GumSDKProvider: React.FC<GumSDKProviderProps> = ({ children }) => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet() as AnchorWallet;
  const sdk = useGumSDK();
  const sessionWallet = useSessionKeyManager(anchorWallet, connection, "mainnet-beta");

  if (!sdk) {
    return null;
  }

  return (
    <GumProvider sdk={sdk}>
      <SessionWalletProvider sessionWallet={sessionWallet}>
        <UploaderProvider
            uploaderType="arweave"
            connection={connection}
            cluster="devnet"
          >
            {children}
        </UploaderProvider>
      </SessionWalletProvider>
    </GumProvider>
  );
};

export default GumSDKProvider;
