'use client';

import TestContractABI from '@/abi/TestContract.json';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit } from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import { useEffect, useState } from 'react';
import { createPublicClient, http, keccak256, toHex } from 'viem';
import { worldchain } from 'viem/chains';

interface TransactionProps {
  price?: string;
  product?: string;
  storeId: string;
  onStakeValidated?: (stakeId: `0x${string}`) => void;
  onStakeReset?: () => void;
  onStakeConfirmed?: () => void;
  className?: string;
}

/**
 * This component is used to get a token from a contract
 * For this to work you need to add the contract address to both contract entrypoints and permit2 tokens
 * inside of  Dev Portal > Configuration > Advanced
 * The general design pattern here is
 * 1. Trigger the transaction
 * 2. Update the transaction_id from the response to poll completion
 * 3. Wait in a useEffect for the transaction to complete
 */
export const Transaction = ({ price, product, storeId, onStakeValidated, onStakeReset, onStakeConfirmed, className }: TransactionProps) => {
  // See the code for this contract here: https://worldscan.org/address/0xF0882554ee924278806d708396F1a7975b732522#code
  const myContractToken = '0xF0882554ee924278806d708396F1a7975b732522';
  const distributorAddress = process.env.NEXT_PUBLIC_DISTRIBUTOR_ADDRESS as `0x${string}` | undefined; // Faucet distributor for 5 VAL
  const refundDistributorAddress = process.env.NEXT_PUBLIC_REFUND_DISTRIBUTOR_ADDRESS as `0x${string}` | undefined; // Faucet distributor for 1 VAL refund
  const valTokenAddress = process.env.NEXT_PUBLIC_VAL_TOKEN_ADDRESS as `0x${string}` | undefined; // VAL token (18 decimals)
  const escrowAddress = process.env.NEXT_PUBLIC_ESCROW_ADDRESS as `0x${string}` | undefined; // Data stake escrow (Permit2)

  const [buttonState, setButtonState] = useState<
    'pending' | 'success' | 'failed' | undefined
  >(undefined);
  const [whichButton, setWhichButton] = useState<'stake'>('stake');
  const [stakePrice, setStakePrice] = useState<string>(price ?? '');
  const [lastStakeId, setLastStakeId] = useState<`0x${string}` | ''>('');
  const [isStakeValidated, setIsStakeValidated] = useState<boolean | null>(null);
  const [isFaucetPriceValid, setIsFaucetPriceValid] = useState<boolean>(false);
  const [hasStaked, setHasStaked] = useState<boolean>(false);

  // This triggers the useWaitForTransactionReceipt hook when updated
  const [transactionId, setTransactionId] = useState<string>('');

  // Feel free to use your own RPC provider for better performance
  const client = createPublicClient({
    chain: worldchain,
    transport: http(process.env.WORLDCHAIN_RPC_URL || 'https://worldchain-mainnet.g.alchemy.com/public'),
  });

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
    error,
  } = useWaitForTransactionReceipt({
    client: client,
    appConfig: {
      app_id: process.env.NEXT_PUBLIC_APP_ID as `app_${string}`,
    },
    transactionId: transactionId,
  });

  useEffect(() => {
    if (transactionId && !isConfirming) {
      if (isConfirmed) {
        console.log('Transaction confirmed!');
        setButtonState('success');
        setTimeout(() => {
          setButtonState(undefined);
          // Call the callback to auto-close the store page after showing success message
          onStakeConfirmed?.();
        }, 3000);
      } else if (isError) {
        console.error('Transaction failed:', error);
        console.error('Transaction ID:', transactionId);
        console.error('Error details:', error);
        setButtonState('failed');
        setTimeout(() => {
          setButtonState(undefined);
        }, 3000);
      }
    }
  }, [isConfirmed, isConfirming, isError, error, transactionId, onStakeConfirmed]);

  // Update stake price when prop changes
  useEffect(() => {
    if (price !== undefined) {
      setStakePrice(price);
    }
  }, [price]);


  // ----- Stake 1 VAL with Permit2 (escrow) -----
  // Escrow ABI (only the functions we call)
  const EscrowABI = [
    {
      inputs: [
        {
          components: [
            { components: [{ internalType: 'address', name: 'token', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], internalType: 'struct ISignatureTransfer.TokenPermissions', name: 'permitted', type: 'tuple' },
            { internalType: 'uint256', name: 'nonce', type: 'uint256' },
            { internalType: 'uint256', name: 'deadline', type: 'uint256' },
          ],
          internalType: 'struct ISignatureTransfer.PermitTransferFrom',
          name: 'permitData',
          type: 'tuple',
        },
        {
          components: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'requestedAmount', type: 'uint256' },
          ],
          internalType: 'struct ISignatureTransfer.SignatureTransferDetails',
          name: 'details',
          type: 'tuple',
        },
        { internalType: 'bytes', name: 'signature', type: 'bytes' },
        { internalType: 'bytes32', name: 'stakeId', type: 'bytes32' },
      ],
      name: 'stakeWithPermit2',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ] as const;

  const onClickStake1WLD = async () => {
    if (!escrowAddress) {
      console.error('Missing NEXT_PUBLIC_ESCROW_ADDRESS');
      return;
    }
    // Use VAL token (confirmed in your Portal Permit2 Tokens)
    const wldAddress = '0xe9D770d3C03D3289EdA927Ed9d0A2a7c84186b6D' as const;

    setTransactionId('');
    setWhichButton('stake');
    setButtonState('pending');

    try {
      // Build a unique stakeId from user + price + timestamp
      const userAddress = (MiniKit.user?.walletAddress || '').toLowerCase();
      const raw = `${userAddress}|${stakePrice}|${Date.now()}`;
      const stakeId = keccak256(toHex(raw));

      // Permit2 placeholders
      const amount = '1000000000000000000'; // 1 VAL (18 decimals)
      const nonce = Math.floor(Date.now() / 1000).toString();
      const deadline = Math.floor(Date.now() / 1000) + 5 * 60; // 5 minutes

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: escrowAddress,
            abi: EscrowABI,
            functionName: 'stakeWithPermit2',
            args: [
              { permitted: { token: wldAddress, amount }, nonce, deadline },
              { to: escrowAddress, requestedAmount: amount },
              'PERMIT2_SIGNATURE_PLACEHOLDER_0',
              stakeId,
            ],
          },
        ],
        permit2: [
          {
            permitted: { token: wldAddress, amount },
            nonce,
            deadline: deadline.toString(),
            spender: escrowAddress,
          },
        ],
      });

      if (finalPayload.status === 'success') {
        console.log('Stake transaction submitted successfully:', finalPayload.transaction_id);
        setLastStakeId(stakeId as `0x${string}`);
        setTransactionId(finalPayload.transaction_id);
        setHasStaked(true);
        // Hidden server-side validation
        try {
          const res = await fetch('/api/stakes/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stakeId, price: stakePrice }),
          });
          const json = await res.json();
          const isValidated = json.ok ? !!json.success : false;
          setIsStakeValidated(isValidated);
          if (isValidated) {
            onStakeValidated?.(stakeId as `0x${string}`);
          } else {
            onStakeReset?.();
          }
        } catch (_) {
          setIsStakeValidated(false);
          onStakeReset?.();
        }
      } else {
        console.error('Stake submission failed:', finalPayload);
        setButtonState('failed');
        setTimeout(() => setButtonState(undefined), 3000);
      }
    } catch (err) {
      console.error('Error sending stake transaction:', err);
      setButtonState('failed');
      setTimeout(() => setButtonState(undefined), 3000);
    }
  };


  return (
    <div className={className}>
      <div className="grid w-full gap-4">
        <LiveFeedback
          label={{ failed: 'Stake failed', pending: 'Staking…', success: 'Stake submitted' }}
          state={whichButton === 'stake' ? buttonState : undefined}
          className="w-full"
        >
          <Button
            onClick={onClickStake1WLD}
            disabled={buttonState === 'pending'}
            size="lg"
            variant="primary"
            className="w-full"
          >
            Stake 1 VAL
          </Button>
        </LiveFeedback>
      </div>
    </div>
  );
};