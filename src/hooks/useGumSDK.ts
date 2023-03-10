import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useGum } from "@gumhq/react-sdk";
import { Cluster, ConfirmOptions, Connection } from "@solana/web3.js";
import { GraphQLClient } from "graphql-request";

export const useGumSDK = (connection: Connection, opts: ConfirmOptions, cluster: Cluster, gqlEndpoint?: string) => {
  const anchorWallet = useAnchorWallet() as AnchorWallet;
  let gqlClient: GraphQLClient | undefined;

  if (gqlEndpoint) {
    gqlClient = new GraphQLClient(gqlEndpoint);
  }

  const sdk = useGum(anchorWallet,connection, opts, cluster, gqlClient);

  return sdk;
};