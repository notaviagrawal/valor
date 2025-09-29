'use client';
import { CircularIcon, Marble } from '@worldcoin/mini-apps-ui-kit-react';
import { createPublicClient, formatUnits, http } from 'viem';
import { worldchain } from 'viem/chains';
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
import { useEffect, useMemo, useState } from 'react';
import { CheckCircleSolid } from 'iconoir-react';
import { useSession } from 'next-auth/react';

/**
 * Minikit is only available on client side. Thus user info needs to be rendered on client side.
 * UserInfo component displays user information including profile picture, username, and verification status.
 * It uses the Marble component from the mini-apps-ui-kit-react library to display the profile picture.
 * The component is client-side rendered.
 */
export const UserInfo = () => {
  // Fetching the user state client side
  const session = useSession();
  const [valBalance, setValBalance] = useState<string>('0');
  // Use provided addresses
  const valToken = useMemo(
    () => '0xe9D770d3C03D3289EdA927Ed9d0A2a7c84186b6D' as const,
    [],
  );
  const walletAddress = useMemo(
    () => '0xcbc440d2bb2371a20f67041e48fe74b421d7bb87' as const,
    [],
  );

  useEffect(() => {
    const run = async () => {
      try {
        const addr = walletAddress;
        const client = createPublicClient({
          chain: worldchain,
          transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
        });
        const raw = (await client.readContract({
          address: valToken,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [addr],
        })) as bigint;
        setValBalance(formatUnits(raw, 18));
      } catch (_) {
        // ignore
      }
    };
    run();
  }, [walletAddress, valToken]);

  return (
    <div className="flex flex-row items-center justify-start gap-4 rounded-xl w-full border-2 border-gray-200 p-4">
      <Marble src={session?.data?.user?.profilePictureUrl} className="w-14" />
      <div className="flex flex-col items-start justify-center">
        <span className="text-lg font-semibold capitalize">
          {session?.data?.user?.username}
        </span>
        {session?.data?.user?.profilePictureUrl && (
          <CircularIcon size="sm" className="ml-0">
            <CheckCircleSolid className="text-blue-600" />
          </CircularIcon>
        )}
        <span className="text-sm text-gray-600">
          VAL: {valBalance}
        </span>
      </div>
    </div>
  );
};
