import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { SocialFeed } from '@/components/SocialFeed'
import dynamic from 'next/dynamic'
import { MyProfile } from '@/components/MyProfile'
import { GumUserCreateButton } from '@/components/CreateUserButton'

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

function Home() {
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
          <MyProfile />
        </div>
        {/* Add a social Feed */}
        <SocialFeed />
        {/* Create user button */}
        <GumUserCreateButton />
      </main>
      </>
  )
}

export default Home;