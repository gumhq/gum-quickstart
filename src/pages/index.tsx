import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useConnection } from '@solana/wallet-adapter-react'
import { useGumSDK } from '@/hooks/useGumSDK'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { SocialFeed } from '@/components/SocialFeed'
import dynamic from 'next/dynamic'
import { MyProfile } from '@/components/MyProfile'

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export default function Home() {
  const network = WalletAdapterNetwork.Devnet;
  const { connection } = useConnection();
  const sdk = useGumSDK(connection, {preflightCommitment: 'confirmed'}, network, "https://light-pelican-32.hasura.app/v1/graphql");

  if (!sdk) {
    return null;
  }
  
  return (
    <>
      <Head>
        <title>Gum Quickstart</title>
        <link rel="icon" href="https://gum.fun/_next/static/media/gum.7b85652b.svg" />
      </Head>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image src="https://gum.fun/_next/static/media/gum.7b85652b.svg" alt="Gum Logo" width={150} height={100} />
        </div>
        <div className={styles.wallet}>
          <WalletMultiButtonDynamic />
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.profileContainer}>
          {/* My Profile */}
          <MyProfile sdk={sdk} />
        </div>
        {/* Add a social Feed */}
        <SocialFeed sdk={sdk} />
      </main>
      </>
  )
}
