import { useGumApp } from '@/contexts/GumAppProviderContext';
import { useCreateUser } from '@gumhq/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';

export function GumUserCreateButton(): JSX.Element {
  const { sdk } = useGumApp();
  const { publicKey } = useWallet();
  const { create, isCreatingUser, createUserError } = useCreateUser(sdk);

  const handleClick = () => {
    if (publicKey) {
      create(publicKey);
    }
  };

  return (
    <>
      {sdk && (
        <button onClick={handleClick}>Create User</button>
      )}
    </>
  );
}
