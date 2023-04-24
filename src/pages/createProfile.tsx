import { useCreateProfile, useGumContext, useSessionWallet, useUploaderContext } from '@gumhq/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '@/styles/CreateProfile.module.css'
import WalletMultiButtonDynamic from '@/components/WalletMultiButtonDynamic';
import { getUserAccount, getProfileAccount } from "@/utils";
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
  const { createProfileIxMethodBuilder } = useCreateProfile(sdk);
  const { handleUpload, uploading, error } = useUploaderContext();

  // check if user has a profile and user account and create them if not
  const createUserAndProfile = async (event: React.FormEvent<HTMLFormElement>, name: string, bio: string, username: string, avatar: string) => {
    event.preventDefault();
    if (!publicKey) {
      console.log("no public key");
      return;
    }

    console.log(`processing create profile for ${publicKey?.toBase58()}`)
    let userPDA = await getUserAccount(sdk, publicKey);
    let profilePDA = await getProfileAccount(sdk, publicKey);
    let instruction: TransactionInstruction[] = [];
    if (!userPDA) {
      const user = await sdk.user.create(publicKey);
      userPDA = user.userPDA;
      const userIx = await user.instructionMethodBuilder.instruction();
      instruction.push(userIx);
    }
    if (!profilePDA && userPDA) {
      console.log("no profile account");
      //  create profile metadata and upload to arweave
      const profileMetadata = {
        name: name,
        bio: bio,
        username: username,
        avatar: avatar,
      };

      const uploadRes = await handleUpload(profileMetadata, wallet);
      if (!uploadRes) {
        console.error("error uploading profile metadata");
        return false;
      }

      const profile = await createProfileIxMethodBuilder(uploadRes.url, "Personal", userPDA , publicKey);
      const res = await profile?.instructionMethodBuilder.preInstructions(instruction).rpc();
      if (!res) {
        console.error("error creating profile");
        return false;
      }
      router.push('/createPost');
    } else {
      alert("You already have a profile, redirecting to home page");
      router.push('/createPost');
    }
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Create Profile</h1>
        <form onSubmit={(event) => createUserAndProfile(event, name, bio, username, avatar)}>
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
