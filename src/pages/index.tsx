import styles from '@/styles/Home.module.css'
import { UserPostsDisplay } from '@/components/UserPosts'
import { MyProfile } from '@/components/MyProfile'
import Header from '@/components/Header'

function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <MyProfile />
        </div>
        <div className={styles.container}>
          <UserPostsDisplay />
        </div>
      </main>
      </>
  )
}

export default Home;