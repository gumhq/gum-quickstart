import { useCreateUser, useGumContext } from '@gumhq/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from '@/styles/components/GumUserCreateButton.module.css';

export function GumUserCreateButton(): JSX.Element {
  const { sdk } = useGumContext();
  const { publicKey } = useWallet();
  const { create, isCreatingUser, createUserError } = useCreateUser(sdk);

  const handleClick = async () => {
    if (publicKey) {
      await create(publicKey);
    }
  };
  
  return (
    <>
      {sdk && (
        <button
          className={`${styles.button} ${isCreatingUser ? styles.disabled : ''}`}
          onClick={handleClick}
          disabled={isCreatingUser}
        >
          {isCreatingUser ? 'Creating User...' : 'Create User'}
        </button>
      )}
      {createUserError && (
        <p className={styles.error}>{createUserError.message}</p>
      )}
    </>
  );
}
