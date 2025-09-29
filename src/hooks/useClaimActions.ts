'use client';

import { MiniKit } from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import { useState, useEffect } from 'react';
import { createPublicClient, http } from 'viem';
import { worldchain } from 'viem/chains';

export const useClaimActions = () => {
    const distributorAddress = process.env.NEXT_PUBLIC_DISTRIBUTOR_ADDRESS as `0x${string}` | undefined;
    const refundDistributorAddress = process.env.NEXT_PUBLIC_REFUND_DISTRIBUTOR_ADDRESS as `0x${string}` | undefined;

    const [buttonState, setButtonState] = useState<'pending' | 'success' | 'failed' | undefined>();
    const [whichButton, setWhichButton] = useState<'claimVal' | 'claimStake' | null>(null);
    const [transactionId, setTransactionId] = useState<string>('');

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

    // Claim 5 VAL via distributor faucet
    const claimReward = async () => {
        console.log('claimReward called');
        console.log('distributorAddress:', distributorAddress);
        console.log('NEXT_PUBLIC_DISTRIBUTOR_ADDRESS:', process.env.NEXT_PUBLIC_DISTRIBUTOR_ADDRESS);
        
        if (!distributorAddress) {
            console.error('Missing NEXT_PUBLIC_DISTRIBUTOR_ADDRESS');
            return;
        }

        setTransactionId('');
        setWhichButton('claimVal');
        setButtonState('pending');

        const DistributorABI = [
            {
                inputs: [],
                name: 'claim',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ] as const;

        try {
            console.log('Sending transaction to MiniKit...');
            const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
                transaction: [
                    {
                        address: distributorAddress,
                        abi: DistributorABI,
                        functionName: 'claim',
                        args: [],
                    },
                ],
            });

            console.log('MiniKit response:', finalPayload);

            if (finalPayload.status === 'success') {
                console.log('Claim reward submitted, waiting for confirmation:', finalPayload.transaction_id);
                setTransactionId(finalPayload.transaction_id);
            } else {
                console.error('Claim reward submission failed:', finalPayload);
                setButtonState('failed');
                setTimeout(() => {
                    setButtonState(undefined);
                }, 3000);
            }
        } catch (err) {
            console.error('Error sending claim reward transaction:', err);
            setButtonState('failed');
            setTimeout(() => {
                setButtonState(undefined);
            }, 3000);
        }
    };

    // Refund via 1 VAL distributor faucet
    const claimRefund = async () => {
        if (!refundDistributorAddress) {
            console.error('Missing NEXT_PUBLIC_REFUND_DISTRIBUTOR_ADDRESS');
            return;
        }

        setTransactionId('');
        setWhichButton('claimStake');
        setButtonState('pending');

        const DistributorABI = [
            { inputs: [], name: 'claim', outputs: [], stateMutability: 'nonpayable', type: 'function' },
        ] as const;

        try {
            const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
                transaction: [
                    {
                        address: refundDistributorAddress,
                        abi: DistributorABI,
                        functionName: 'claim',
                        args: [],
                    },
                ],
            });

            if (finalPayload.status === 'success') {
                console.log('Refund submitted, waiting for confirmation:', finalPayload.transaction_id);
                setTransactionId(finalPayload.transaction_id);
            } else {
                console.error('Refund submission failed:', finalPayload);
                setButtonState('failed');
                setTimeout(() => setButtonState(undefined), 3000);
            }
        } catch (err) {
            console.error('Error sending refund transaction:', err);
            setButtonState('failed');
            setTimeout(() => setButtonState(undefined), 3000);
        }
    };

    // Handle transaction confirmation
    useEffect(() => {
        if (transactionId && !isConfirming) {
            if (isConfirmed) {
                console.log('Transaction confirmed!');
                setButtonState('success');
                setTimeout(() => {
                    setButtonState(undefined);
                    setWhichButton(null);
                }, 3000);
            } else if (isError) {
                console.error('Transaction failed:', error);
                setButtonState('failed');
                setTimeout(() => {
                    setButtonState(undefined);
                    setWhichButton(null);
                }, 3000);
            }
        }
    }, [transactionId, isConfirming, isConfirmed, isError, error]);

    return {
        claimReward,
        claimRefund,
        buttonState,
        whichButton,
        isConfirming,
    };
};
