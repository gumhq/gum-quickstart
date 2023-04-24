import { Post } from "@/pages/createPost";
import { SDK } from "@gumhq/react-sdk";
import { PublicKey } from "@solana/web3.js";

export const getUserAccount = async (sdk: SDK, owner: PublicKey) => {
  const user = await sdk.user.getUser(owner);
  if (user) {
    return new PublicKey(user.cl_pubkey);
  }
  return null;
};

export const getProfileAccount = async (sdk: SDK, owner: PublicKey) => {
  const profile = await sdk.profile.getProfile(owner, "Personal"); // Personal is the default profile name
  if (profile) {
    return new PublicKey(profile.cl_pubkey);
  }
  return null;
}

export const getAllPost = async (sdk: SDK, owner: PublicKey) => {
  if (!owner) {
    return;
  }
  const allPosts = await sdk.post.getPostAccountsByUser(owner);

  // Filter posts with metadataUri that starts with "https://arweave.net"
  const filteredPosts = allPosts.filter((element: { account: { metadataUri: string; }; }) => element.account.metadataUri && element.account.metadataUri.startsWith('https://arweave.net'));

  // Iterate over filtered posts and get the content
  const posts = await Promise.all(filteredPosts.map(async (element: { account: { metadataUri: RequestInfo | URL; }; publicKey: any; }) => {
    const response = await fetch(element.account.metadataUri);
    const data = await response.json();
    // include metadataUri in the data
    data.metadataUri = element.account.metadataUri;
    // how to get the transaction id of an solana account?
    const txSignature = await sdk.rpcConnection.getSignaturesForAddress(element.publicKey);
    if (txSignature.length === 0) {
      return data;
    }
    const txUrl = `https://solana.fm/tx/${txSignature[0].signature}?cluster=devnet-solana`
    data.transactionUrl = txUrl;
    return data as Post;
  }));
  return posts as Post[];
};