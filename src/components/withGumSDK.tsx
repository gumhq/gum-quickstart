// This HOC enhances a component by providing the Gum SDK via the GumAppProvider context
// The Gum SDK is retrieved using the useGumSDK hook and passed as a prop to the GumAppProvider component
// The HOC is used to wrap any component that requires access to the Gum SDK
// Usage: withGumSDK(MyComponent)

import React from 'react';
import { GumAppProvider } from '@/contexts/GumAppProviderContext';
import { SDK } from '@gumhq/react-sdk';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useConnection } from '@solana/wallet-adapter-react';
import { useGumSDK } from '@/hooks/useGumSDK';

interface WithGumSDKProps {
  sdk: SDK;
}

// Define the withGumSDK HOC that wraps a component and provides the Gum SDK
export const withGumSDK = (
  WrappedComponent: React.ComponentType<WithGumSDKProps>
) => {
  const HOC: React.FC<WithGumSDKProps> = (props) => {
    const network = WalletAdapterNetwork.Devnet;
    const { connection } = useConnection();
    const sdk = useGumSDK(connection, {preflightCommitment: 'confirmed'}, network, "https://light-pelican-32.hasura.app/v1/graphql");

    if (!sdk) {
      return null;
    }
    
    return (
      <GumAppProvider sdk={sdk}>
        <WrappedComponent {...props} />
      </GumAppProvider>
    );
  };

  return HOC;
};
