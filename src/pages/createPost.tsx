import { getProfileAccount } from "@/utils";
import { useCreatePost, useGumContext, useSessionWallet, useUploaderContext, GPLCORE_PROGRAMS, useReaction } from "@gumhq/react-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { use, useEffect, useState } from "react";
import styles from '@/styles/Home.module.css';
import PostDisplay from '@/components/PostDisplay';
import Header from "@/components/Header";

export type PostData = {
  content: {
    content: string;
    format: string;
  };
  type: string;
  authorship: {
    signature: string;
    publicKey: string;
  };
  app_id: string;
  metadataUri: string;
  transactionUrl: string;
  reaction: string[];
  address: string;
};

const PostCreator = () => {
  const [postContent, setPostContent] = useState("");
  const { sdk } = useGumContext();
  const wallet = useWallet();
  const session = useSessionWallet();
  const cluster = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "devnet" | "mainnet-beta") || 'devnet';
  const { publicKey: sessionPublicKey, sessionToken, createSession, sendTransaction }  = session;
  const { handleUpload, uploading, error } = useUploaderContext();
  const { createWithSession, postPDA, createPostError } = useCreatePost(sdk);
  const [profile, setProfile] = useState<PublicKey | undefined>(undefined);
  const [posts, setPosts] = useState<PostData[]>([]);

  console.log(`Error: ${createPostError}`);
  
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

  const handlePostCreation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedSession = await refreshSession();

    if (!updatedSession || !updatedSession.sessionToken || !updatedSession.publicKey || !updatedSession.signMessage || !updatedSession.sendTransaction || !profile) {
      console.log(` profile: ${profile}`);
      console.log("Session or profile details missing");
      return;
    }

    const postArray = new TextEncoder().encode(postContent);
    const signature = await updatedSession.signMessage(postArray);
    const signatureString = JSON.stringify(signature.toString());

    let metadata = {
      content: {
        content: postContent,
        format: "markdown",
      },
      type: "text",
      authorship: {
        publicKey: updatedSession.publicKey.toBase58(),
        signature: signatureString,
      },
      app_id: "gum-quickstart",
    } as PostData;

    const uploader = await handleUpload(metadata, updatedSession);
    if (!uploader) {
      console.log("Error uploading post");
      return;
    }

    const postResponse = await createWithSession(uploader.url, profile, updatedSession.publicKey, new PublicKey(updatedSession.sessionToken), updatedSession.sendTransaction);
    if (!postResponse || !postPDA) {
      console.log("Error creating post");
      return;
    }

    metadata = {
      ...metadata,
      address: postPDA.toBase58(),
      metadataUri: uploader.url,
      transactionUrl: cluster === 'devnet' ? `https://solana.fm/tx/${postResponse}?cluster=devnet-solana` : `https://solana.fm/tx/${postResponse}?cluster=mainnet-solanafmbeta`,
      reaction: [],
    };

    setPosts((prevState) => [metadata, ...prevState]);

    setPostContent("");
  };

  useEffect(() => {
    const getPostsWithReaction = async () => {
      if (!wallet.publicKey) return;
      const posts = await sdk.post.getPostsByAuthority(wallet.publicKey);
      
      const postsWithReactionPromises = posts.map(async (post) => {
        const reactionData = await sdk.reaction.getReactionsByPost(new PublicKey(post.address));
        const reactions = reactionData.map((reaction) => reaction.reaction_type);

        return {
          ...post,
          ...post.metadata,
          reactions: reactions,
        };
      });

      const postsWithReaction = await Promise.all(postsWithReactionPromises);

      setPosts(postsWithReaction);
    };

    getPostsWithReaction();
  }, [sdk, wallet.publicKey]);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <form onSubmit={handlePostCreation}>
            <input
              type="text"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        <PostDisplay posts={posts} />
      </main>
    </>
  );
};

export default PostCreator;

