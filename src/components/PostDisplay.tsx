import { useInitializeProfile } from '@/hooks/useInitializeProfile';
import { PostData } from '@/pages/createPost';
import styles from '@/styles/Home.module.css'
import { refreshSession } from '@/utils';
import { useGumContext, useSessionWallet, useReaction, GPLCORE_PROGRAMS } from '@gumhq/react-sdk';
import { PublicKey } from '@solana/web3.js';
import Image from 'next/image';

const PostDisplay = ({ posts, onReactionCreated }: { posts: PostData[], onReactionCreated: (reactionType: string, postAddress: string) => void }) => {
  // const { sdk } = useGumContext();
  // const session = useSessionWallet();
  // const { createReactionWithSession } = useReaction(sdk);
  // const profile = useInitializeProfile();
  // const cluster = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "devnet" | "mainnet-beta") || 'devnet';

  // const createReactionHandler = async (post: PostData, reaction: string) => {
  //   const updatedSession = await refreshSession(session, cluster);

  //   if (!updatedSession || !profile || !updatedSession.publicKey || !updatedSession.sessionToken || !updatedSession.sendTransaction) return;
  //   const reactionData = await createReactionWithSession(reaction, profile, new PublicKey(post.address), updatedSession.publicKey, new PublicKey(updatedSession.sessionToken), updatedSession.publicKey, updatedSession.sendTransaction);
  //   console.log(`Reaction data: ${reactionData}`);
  // };

  return (
    <div className={styles.posts}>
      {posts.map((post: any, index: number) => (
        <div className={styles.post} key={index}>
          <div className={styles.postContent}>
            <div className={styles.postText}>{post.content.content}</div>
            <div className={styles.reactionBtns}>
              {post.reactions && post.reactions.map((reaction: string, index: number) => (
                <span key={index}>{reaction}</span>
              ))}
            </div>
            <div className={styles.reactionBtns}>
              <button onClick={() => onReactionCreated("❤️", post.address)}>❤️</button>
              <button onClick={() => onReactionCreated("😄", post.address)}>😄</button>
              <button onClick={() => onReactionCreated("😂", post.address)}>😂</button>
              <button onClick={() => onReactionCreated("👍", post.address)}>👍</button>
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
