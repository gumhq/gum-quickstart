import { useGumContext } from '@gumhq/react-sdk';
import styles from '@/styles/Home.module.css';
import { PublicKey } from '@solana/web3.js';
import { Feed, PostMetadata, ProfileMetadata } from '@gumhq/ui-components';
import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export function UserPostsDisplay() {
  const wallet = useWallet();
  const { sdk } = useGumContext();
  const [userPosts, setUserPosts] = useState<any[]>([]);

  useEffect(() => {
    if (wallet.connected) {
      fetchUserPosts();
    }
  }, [wallet.connected, sdk, wallet.publicKey]);

  const fetchUserPosts = async () => {
    const posts = await sdk.post.getPostsByAuthority(wallet.publicKey as PublicKey);
    const postWithProfiles = await Promise.all(posts.map(fetchProfileForPost));
    setUserPosts(postWithProfiles);
  };

  const fetchProfileForPost = async (post: any) => {
    const profile = await sdk.profile.getProfilesByProfileAccount(new PublicKey(post.profile));
    return {
      post: {
        type: post.metadata.type,
        content: post.metadata.content,
      } as PostMetadata,
      profile: {
        ...profile.metadata,
        following: 0,
        followers: 0,
      } as ProfileMetadata,
    };
  };

  return (
    <div className={styles.feedContainer}>
      <h1 className={styles.heading}>User Posts</h1>
      {userPosts.length > 0 && (
        <Feed posts={userPosts} skip={0} show={userPosts.length} gap={0.5} />
      )}
    </div>
  );
}
