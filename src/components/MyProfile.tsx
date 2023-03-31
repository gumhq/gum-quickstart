import { SDK, useGumContext, useProfile } from '@gumhq/react-sdk';
import { Profile } from '@gumhq/ui-components';
import { PublicKey } from '@solana/web3.js';

interface Props {
  sdk: SDK;
}

export function MyProfile() {
  const { sdk } = useGumContext();
  const { profile } = useProfile(sdk, new PublicKey("koESe1SzjdCtV25tDr4g58cjCVWKE3vBE1h8LobivY5"));
  
  const profileData = {
    ...profile?.metadata.data,
    following: profile?.following || 0,
    followers: profile?.followers || 0,
  }

  return (
    <Profile data={profileData} />
  );
}