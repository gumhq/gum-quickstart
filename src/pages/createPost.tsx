import { getPostsWithReaction, getProfileAccount, refreshSession } from "@/utils";
import { useCreatePost, useGumContext, useSessionWallet, useUploaderContext, GPLCORE_PROGRAMS, useReaction } from "@gumhq/react-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { use, useEffect, useState } from "react";
import styles from '@/styles/Home.module.css';
import PostDisplay from '@/components/PostDisplay';
import Header from "@/components/Header";
import { useInitializeProfile } from "@/hooks/useInitializeProfile";

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
  const { createReactionWithSession } = useReaction(sdk);
  const profile = useInitializeProfile();
  const [posts, setPosts] = useState<PostData[]>([]);

  console.log(`Error: ${createPostError}`);

  const createPostHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedSession = await refreshSession(session, cluster);

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

  const createReactionHandler = async (reaction: string, postAddress: string) => {
    const updatedSession = await refreshSession(session, cluster);

    if (!updatedSession || !profile || !updatedSession.publicKey || !updatedSession.sessionToken || !updatedSession.sendTransaction) return;
    const reactionData = await createReactionWithSession(reaction, profile, new PublicKey(postAddress), updatedSession.publicKey, new PublicKey(updatedSession.sessionToken), updatedSession.publicKey, updatedSession.sendTransaction);
    console.log(`Reaction data: ${reactionData}`);
  };

  const handleReactionCreated = async (reactionType: string, postAddress: string) => {
    if (!wallet.publicKey) return;
    await createReactionHandler(reactionType, postAddress);
    const updatedPostsWithReaction = await getPostsWithReaction(sdk, wallet.publicKey);
    setPosts(updatedPostsWithReaction);
  };

  useEffect(() => {
    if (!wallet.publicKey) return;
    getPostsWithReaction(sdk, wallet.publicKey).then((posts) => setPosts(posts));
  }, [sdk, wallet.publicKey]);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <form onSubmit={createPostHandler}>
            <input
              type="text"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        <PostDisplay posts={posts} onReactionCreated={handleReactionCreated} />
      </main>
    </>
  );
};

export default PostCreator;

