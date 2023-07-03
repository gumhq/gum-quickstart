import { useGumContext } from '@gumhq/react-sdk';
import { Profile as ProfileComponent } from '@gumhq/ui-components';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from '@/styles/Home.module.css';
import React from 'react';
import { useRouter } from 'next/router';

export function MyProfile() {
  const wallet = useWallet();
  const { sdk } = useGumContext();
  const router = useRouter();
  const [myProfiles, setMyProfiles] = React.useState([] as any); 

  React.useEffect(() => {
    const getMyProfile = async () => {
      if (sdk && wallet.publicKey) {
        const myProfile = await sdk.profile.getProfilesByAuthority(wallet.publicKey) || [];
        setMyProfiles(myProfile);
      }
    };
    getMyProfile();
  }, [sdk, wallet.publicKey]);

  // If there are no profiles, render a message saying so.
  if (myProfiles.length === 0) {
    return (
      <div>
        <h2 className={styles.heading}>{myProfiles.length > 1 ? "My Profiles" : "My Profile"}</h2>
        <div>
          <button
            className={`${styles.button}`}
            onClick={() => router.push('/createProfile')}
          >
            {'Create Profile'}
          </button>
        </div>
        <div>
          No profiles found. You can create one using the button above.
        </div>
      </div>
    );
  }

  // Map over the array of myProfiles, creating a Profile component for each one.
  const profileComponents = myProfiles.map((myProfile: any, index: any) => {
    // Construct profile data for each profile.
    const profileData = {
      ...myProfile.metadata,
      following: myProfile.following || 0,
      followers: myProfile.followers || 0,
    };

    return (
      <div key={index} style={{ paddingBottom: '20px' }}>
        <ProfileComponent data={profileData} />
      </div>
    );
  });

  return (
    <div>
      <h2 className={styles.heading}>{myProfiles.length > 1 ? "My Profiles" : "My Profile"}</h2>
      {profileComponents}
    </div>
  );
}
