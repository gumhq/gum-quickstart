import { useGumContext, useProfile } from '@gumhq/react-sdk';
import { Profile } from '@gumhq/ui-components';
import { PublicKey } from '@solana/web3.js';
import React from 'react';


export function MyProfile() {
  const { sdk } = useGumContext();
  const { profile } = useProfile(sdk, new PublicKey("EN6p8RDx5YdfpzsXwuTS2g8VzVP6m9yBKHsAFK9PkK6X"));

  const profileData = React.useMemo(() => {
    return {
      ...profile?.metadata,
      following: profile?.following || 0,
      followers: profile?.followers || 0,
    }
  }, [profile]);

  return (
    <Profile data={profileData} />
  );
}