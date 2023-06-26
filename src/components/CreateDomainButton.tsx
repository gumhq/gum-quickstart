import { useGumContext, useNameService } from '@gumhq/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from '@/styles/components/DomainCreationButton.module.css';
import { useState } from 'react';

export function DomainCreationButton(): JSX.Element {
  const { sdk } = useGumContext();
  const { publicKey } = useWallet();
  const { getOrCreateTLD, getOrCreateDomain, isCreating, creationError } = useNameService(sdk);
  const [userDomain, setUserDomain] = useState('');

  const handleDomainCreation = async () => {
    if (publicKey) {
      const gumTopLevelDomain = await getOrCreateTLD('gum');
      if (!gumTopLevelDomain) {
        throw new Error('Gum TLD not found');
      }
      const newDomainAccount = await getOrCreateDomain(gumTopLevelDomain, userDomain, publicKey);
      if (!newDomainAccount) {
        throw new Error('Domain not found');
      }
      console.log('Domain created', newDomainAccount);
    }
  };

  return (
    <>
      {sdk && (
        <>
          <input
            type="text"
            value={userDomain}
            onChange={(event) => setUserDomain(event.target.value)}
            placeholder="Enter domain name"
            className={styles.input}
          />
          <button
            className={`${styles.button} ${isCreating ? styles.disabled : ''}`}
            onClick={handleDomainCreation}
            disabled={isCreating}
          >
            {isCreating ? 'Creating Domain...' : 'Create Domain'}
          </button>
        </>
      )}
      {creationError && (
        <p className={styles.error}>{creationError.message}</p>
      )}
    </>
  );
}
