import { useFeed, useGumContext } from '@gumhq/react-sdk'
import styles from '@/styles/Home.module.css'
import { PublicKey } from '@solana/web3.js'
import { Feed, PostMetadata, ProfileMetadata } from '@gumhq/ui-components';

export function SocialFeed() {
  const { sdk } = useGumContext();
  const { feedData } = useFeed(sdk, new PublicKey("FSc4aAr9n84AYsAVFSs25hxde3v3zW5yTzU9AVmtnvkG"));

  const feed = feedData?.map((post: any) => {
    const profileData = post.profile_metadata.data;
    const metadata = post.metadata;
    return {
      post: {
        type: metadata.type,
        content: metadata.data.content,
      } as PostMetadata,
      profile: profileData as ProfileMetadata,
    }
  });

  return (
    <div className={styles.feedContainer}>
      <h1 className={styles.feedTitle}>Social Feed</h1>
      {
        feed && (
          <Feed posts={feed} skip={0} show={feed ? feed.length : 0} gap={0.5} />
        )
      }
    </div>
  )
}
