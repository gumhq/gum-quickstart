import Head from 'next/head';
import WalletMultiButtonDynamic from './WalletMultiButtonDynamic';
import styles from '@/styles/Home.module.css';
import Image from 'next/image';

const Header = () => {
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
    </>
  );
};

export default Header;
