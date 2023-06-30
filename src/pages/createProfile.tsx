import { useCreateProfile, useGumContext, useUploaderContext } from '@gumhq/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '@/styles/CreateProfile.module.css'
import Header from '@/components/Header';

function CreateProfile() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const router = useRouter();
  const wallet = useWallet();
  const { publicKey } = wallet;
  const { sdk } = useGumContext();
  const { createProfileWithDomain, createProfileError } = useCreateProfile(sdk);
  const { handleUpload, uploading, error } = useUploaderContext();
  console.log(`Error: ${createProfileError}`)
  // check if user has a profile and user account and create them if not
  const createDomainAndProfile = async (event: React.FormEvent<HTMLFormElement>, name: string, bio: string, username: string, avatar: string) => {
    event.preventDefault();
    if (!publicKey) {
      console.log("no public key");
      return;
    }

    console.log(`processing create profile for ${publicKey?.toBase58()}`)
    let profilePDA = await sdk.profile.getProfileByDomainName(username);
    if (profilePDA) {
      console.log("profile account found with username", username);
      router.push('/createPost');
    }

    //  create profile metadata and upload to arweave
    const profileMetadata = {
      name: name,
      bio: bio,
      avatar: avatar,
    };

    const uploadRes = await handleUpload(profileMetadata, wallet);
    if (!uploadRes) {
      console.error("error uploading profile metadata");
      return false;
    }
    const res = await createProfileWithDomain(uploadRes.url, username, publicKey)
    if (!res) {
      console.error("error creating profile");
      return false;
    }
    router.push('/createPost');
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Create Profile</h1>
        <form onSubmit={(event) => createDomainAndProfile(event, name, bio, username, avatar)}>
          <label htmlFor="name" className={styles.label}>Name</label>
          <input type="text" id="name" value={name} onChange={(event) => setName(event.target.value)} className={styles.input} />
          <label htmlFor="bio" className={styles.label}>Bio</label>
          <input type="text" id="bio" value={bio} onChange={(event) => setBio(event.target.value)} className={styles.input} />
          <label htmlFor="username" className={styles.label}>Username</label>
          <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} className={styles.input} />
          <label htmlFor="avatar" className={styles.label}>Avatar</label>
          <input type="text" id="avatar" value={avatar} onChange={(event) => setAvatar(event.target.value)} className={styles.input} />
          <button type="submit" className={styles.submitButton}>Create Profile</button>
        </form>
      </div>
    </>
  );
}

export default CreateProfile;
