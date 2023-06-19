import { useGumContext, useNameService } from '@gumhq/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from '@/styles/components/GumUserCreateButton.module.css';
import { useState } from 'react';

export function GumDomainCreateButton(): JSX.Element {
  const { sdk } = useGumContext();
  const { publicKey } = useWallet();
  const { getOrCreateTLD, getOrCreateDomain, isCreating, creationError } = useNameService(sdk);
  const [domain, setDomain] = useState('');

  const handleClick = async () => {
    if (publicKey) {
      const gumTld = await getOrCreateTLD('gum');
      if (!gumTld) {
        throw new Error('Gum TLD not found');
      }
      const domainAccount = await getOrCreateDomain(gumTld, domain, publicKey);
      if (!domainAccount) {
        throw new Error('Domain not found');
      }
      console.log('Domain created', domainAccount);
    }
  };
  
  return (
    <>
      {sdk && (
        <>
        <input
          type="text"
          value={domain}
          onChange={(event) => setDomain(event.target.value)}
          placeholder="Enter domain name"
          className={styles.input}
        />
        <button
          className={`${styles.button} ${isCreating ? styles.disabled : ''}`}
          onClick={handleClick}
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
