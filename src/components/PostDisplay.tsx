import { PostData } from '@/pages/createPost';
import styles from '@/styles/Home.module.css'
import { getProfileAccount } from '@/utils';
import { useGumContext, useSessionWallet, useReaction, GPLCORE_PROGRAMS } from '@gumhq/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const PostDisplay = ({ posts }: any) => {
  const { sdk } = useGumContext();
  const wallet = useWallet();
  const session = useSessionWallet();
  const { publicKey: sessionPublicKey, sessionToken, createSession }  = session;
  const { createReactionWithSession } = useReaction(sdk);
  const [profile, setProfile] = useState<PublicKey | undefined>(undefined);
  const cluster = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "devnet" | "mainnet-beta") || 'devnet';

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

  const refreshSession = async () => {
    if (!sessionToken) {
      const targetProgramId = GPLCORE_PROGRAMS[cluster];
      const topUp = true; 
      const sessionDuration = 60;
      return await createSession(targetProgramId, topUp, sessionDuration);
    }
    return session;
  };

  const createReaction = async (post: PostData, reaction: string) => {
    const updatedSession = await refreshSession();

    if (!updatedSession || !profile || !updatedSession.publicKey || !updatedSession.sessionToken || !updatedSession.sendTransaction) return;
    const reactionData = await createReactionWithSession(reaction, profile, new PublicKey(post.address), updatedSession.publicKey, new PublicKey(updatedSession.sessionToken), updatedSession.publicKey, updatedSession.sendTransaction);
    console.log(`Reaction data: ${reactionData}`);
  };

  return (
    <div className={styles.posts}>
      {posts.map((post: any, index: string) => (
        <div className={styles.post} key={index}>
          <div className={styles.postContent}>
            <div className={styles.postText}>{post.content.content}</div>
            <div className={styles.reactionBtns}>
              {post.reactions && post.reactions.map((reaction: string, index: string) => (
                <span key={index}>{reaction}</span>
              ))}
            </div>
            <div className={styles.reactionBtns}>
              <button onClick={() => createReaction(post,"😄")}>😄</button>
              <button onClick={() => createReaction(post,"❤️")}>❤️</button>
              <button onClick={() => createReaction(post,"😂")}>😂</button>
              <button onClick={() => createReaction(post,"👍")}>👍</button>
            </div>
          </div>
          <div className={styles.logos}>
            {post.metadataUri && (
              <a href={post.metadataUri} target="_blank" rel="noopener noreferrer">
                <Image className={styles.logo} src="https://seeklogo.com/images/A/arweave-ar-logo-7458401CAE-seeklogo.com.png" alt="Arweave Metadata" width={20} height={20} />
              </a>
            )}
            {post.transactionUrl && (
              <a href={post.transactionUrl} target="_blank" rel="noopener noreferrer">
                <Image className={styles.logo} src="https://seeklogo.com/images/S/solana-sol-logo-12828AD23D-seeklogo.com.png" alt="Solana Tx" width={20} height={20} />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostDisplay;
