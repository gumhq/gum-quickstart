import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { getProfileAccount } from '@/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGumContext } from '@gumhq/react-sdk';

export const useInitializeProfile = () => {
  const { sdk } = useGumContext();
  const wallet = useWallet();
  const [profile, setProfile] = useState<PublicKey | undefined>(undefined);

  useEffect(() => {
    const initializeProfile = async () => {
      if (wallet.publicKey) {
        const profileAccount = await getProfileAccount(sdk, wallet.publicKey);
        if (profileAccount) {
          setProfile(profileAccount);
        } else {
          console.log("Profile account not found, please create profile");
        }
      }
    };
    initializeProfile();
  }, [sdk, wallet.publicKey]);

  return profile;
};
