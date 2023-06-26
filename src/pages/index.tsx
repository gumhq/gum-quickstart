import styles from '@/styles/Home.module.css'
import { SocialFeed } from '@/components/SocialFeed'
import { MyProfile } from '@/components/MyProfile'
import { DomainCreationButton } from '@/components/CreateDomainButton'
import Header from '@/components/Header'

function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <MyProfile />
        </div>
        <DomainCreationButton />
      </main>
      </>
  )
}

export default Home;