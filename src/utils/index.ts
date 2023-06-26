import { PostData } from "@/pages/createPost";
import { SDK } from "@gumhq/react-sdk";
import { PublicKey } from "@solana/web3.js";

export const getProfileAccount = async (sdk: SDK, owner: PublicKey) => {
  const profile = await sdk.profile.getProfilesByAuthority(owner);
  if (profile) {
    return new PublicKey(profile[0].address);
  }
  return null;
}

export const getAllPost = async (sdk: SDK, owner: PublicKey) => {
  const cluster = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "devnet" | "mainnet-beta") || 'devnet';
  if (!owner) {
    return;
  }
  const allPosts = await sdk.post.getPostsByAuthority(owner);

    // Filter posts with metadataUri that starts with "https://arweave.net"
    const filteredPosts = allPosts.filter((element) => element.metadata_uri?.startsWith('https://arweave.net'));

  // Iterate over filtered posts and get the content
    const posts = await Promise.all(filteredPosts.map(async (element) => {
      const response = await fetch(element.metadata_uri as RequestInfo | URL);
    const data = await response.json();
    // include metadataUri in the data
    data.metadataUri = element.metadata_uri;
    // how to get the transaction id of an solana account?
    const txSignature = await sdk.rpcConnection.getSignaturesForAddress(new PublicKey(element.address));
    if (txSignature.length === 0) {
      return data;
    }
    const txUrl = cluster === 'devnet' ? `https://solana.fm/tx/${txSignature[0].signature}?cluster=devnet-solana` : `https://solana.fm/tx/${txSignature[0].signature}?cluster=mainnet-solanafmbeta`;
    data.transactionUrl = txUrl;
    return data as PostData;
  }));
  return posts as PostData[];
};