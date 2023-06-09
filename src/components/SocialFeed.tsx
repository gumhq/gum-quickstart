import { useFeed, useGumContext } from '@gumhq/react-sdk'
import styles from '@/styles/Home.module.css'
import { PublicKey } from '@solana/web3.js'
import { Feed, PostMetadata, ProfileMetadata } from '@gumhq/ui-components';

export function SocialFeed() {
  const { sdk } = useGumContext();
  const { feedData } = useFeed(sdk, new PublicKey("6FKC12h85MmiZ1WtYamRJE3SpcrgUkSr8maWsLAoKwjQ"));

  const feed = feedData?.map((post: any) => {
    const profileData = post.profile_metadata;
    const metadata = post.metadata;
    return {
      post: {
        type: metadata.type,
        content: metadata.content,
      } as PostMetadata,
      profile: profileData as ProfileMetadata,
    }
  });

  return (
    <div className={styles.feedContainer}>
      <h1 className={styles.feedTitle}>Social Feed</h1>
      {
        feed && (
          <Feed posts={feed} skip={0} show={feed ? 5 : 0} gap={0.5} />
        )
      }
    </div>
  )
}
