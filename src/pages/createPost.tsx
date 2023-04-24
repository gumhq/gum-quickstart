import { getProfileAccount, getUserAccount } from "@/utils";
import { useCreatePost, useGumContext, useSessionWallet, useUploaderContext } from "@gumhq/react-sdk";
import { GPLCORE_PROGRAMS } from "@gumhq/sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import styles from '@/styles/Home.module.css'
import Post from '@/components/Post';
import Header from "@/components/Header";
import { useRouter } from "next/router";

export type Post = {
  content: {
    content: string;
    format: string;
  };
  type: string;
  authorship: {
    signature: string;
    publicKey: string;
  };
  metadataUri: string;
  transactionUrl: string;
};

const CreatePost = () => {
  const [post, setPost] = useState("");
  const { sdk } = useGumContext();
  const wallet = useWallet();
  const session = useSessionWallet();
  const { publicKey, sessionToken, createSession, ownerPublicKey, sendTransaction }  = session;
  const { handleUpload, uploading, error } = useUploaderContext();
  const { create, createPostError } = useCreatePost(sdk);
  const [user, setUser] = useState<PublicKey | undefined>(undefined);
  const [profile, setProfile] = useState<PublicKey | undefined>(undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    const setUp = async () => {
      if (wallet.publicKey) {
        const userAccount = await getUserAccount(sdk, wallet.publicKey);
        if (userAccount) {
          setUser(userAccount);
          const profileAccount = await getProfileAccount(sdk, userAccount);
          if (profileAccount) {
            setProfile(profileAccount);
          } else {
            router.push("/createProfile");
          }
        } else {
          router.push("/createProfile");
        }
      }
    };
    setUp();
  }, [router, sdk, wallet.publicKey]);
  
  const updateSession = async () => {
    if (!sessionToken) {
      const targetProgramId = GPLCORE_PROGRAMS["devnet"];
      const topUp = true; // this will transfer 0.01 SOL to the session wallet
      const sessionDuration = 60;
      return await createSession(targetProgramId, topUp, sessionDuration);
    }
    return session;
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const session = await updateSession();

    if (!session) {
      console.log("missing session");
      return;
    }
    if (!session.sessionToken || !session.publicKey || !session.signMessage || !session.sendTransaction || !profile || !user) {
      console.log(` profile: ${profile} user: ${user}`);
      console.log("missing session or profile or user");
      return;
    }

    // sign the post with the session wallet
    const postArray = new TextEncoder().encode(post);
    const signature = await session.signMessage(postArray);
    const signatureString = JSON.stringify(signature.toString());

    // create the post metadata
    const metadata = {
      content: {
        content: post,
        format: "markdown",
      },
      type: "text",
      authorship: {
        publicKey: session.publicKey.toBase58(),
        signature: signatureString,
      },
      metadataUri: '',
      transactionUrl: '',
    };

    // upload the post to arweave
    const uploader = await handleUpload(metadata, session);
    if (!uploader) {
      console.log("error uploading post");
      return;
    }

    // create the post
    const txRes = await create(uploader.url, profile, user, session.publicKey, new PublicKey(session.sessionToken), session.sendTransaction);
    if (!txRes) {
      console.log("error creating post");
      return;
    }
    metadata.metadataUri = uploader.url;
    metadata.transactionUrl = `https://solana.fm/tx/${txRes}?cluster=devnet-solana`;

    setPosts((prevState) => [metadata, ...prevState])

    setPost("");
  };

  return (
    <>
    <Header />
    <main className={styles.main}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={post}
            onChange={(e) => setPost(e.target.value)}
            placeholder="What's on your mind?"
          />

          <button type="submit">Submit</button>
        </form>
      </div>
      <Post posts={posts} />
    </main>
    </>
  );
};

export default CreatePost;