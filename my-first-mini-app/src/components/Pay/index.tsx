'use client';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit, Tokens, tokenToDecimals, Network } from '@worldcoin/minikit-js';
import { useState } from 'react';

/**
 * This component is used to pay a user
 * The payment command simply does an ERC20 transfer
 * But, it also includes a reference field that you can search for on-chain
 */
export const Pay = () => {
  const [buttonState, setButtonState] = useState<
    'pending' | 'success' | 'failed' | undefined
  >(undefined);

  const onClickPay = async () => {
    try {
      setButtonState('pending');

      // Check if MiniKit is installed
      if (!MiniKit.isInstalled()) {
        console.error('MiniKit is not installed');
        setButtonState('failed');
        return;
      }

      console.log('Starting payment process...');

      // Get payment reference from backend
      const res = await fetch('/api/initiate-payment', {
        method: 'POST',
      });
      const { id } = await res.json();
      console.log('Payment reference ID:', id);

      // Use your MetaMask wallet address
      const toAddress = '0xcbc440d2bb2371a20f67041e48fe74b421d7bb87';

      // Use minimum amounts that meet the $0.1 requirement
      const paymentPayload = {
        reference: id,
        to: toAddress,
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: '500000000000000000', // 0.5 WLD (18 decimals)
          },
        ],
        network: Network.WorldChain,
        description: 'Test example payment for minikit',
      };

      console.log('Payment payload:', paymentPayload);

      const result = await MiniKit.commandsAsync.pay(paymentPayload);

      console.log('Payment result:', result);
      console.log('Final payload:', result.finalPayload);

      if (result.finalPayload.status === 'success') {
        console.log('Payment successful, confirming...');
        // Confirm the payment in the backend
        const confirmRes = await fetch('/api/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result.finalPayload),
        });

        const payment = await confirmRes.json();
        console.log('Confirmation result:', payment);

        if (payment.success) {
          setButtonState('success');
          console.log('Payment confirmed successfully!');
        } else {
          setButtonState('failed');
          console.error('Payment confirmation failed:', payment.error);
        }
      } else {
        setButtonState('failed');
        console.error('Payment failed with status:', result.finalPayload.status);
        console.error('Error code:', result.finalPayload.error_code);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setButtonState('failed');
    } finally {
      // Reset button state after 3 seconds
      setTimeout(() => {
        setButtonState(undefined);
      }, 3000);
    }
  };

  return (
    <div className="grid w-full gap-4">
      <p className="text-lg font-semibold">Pay</p>
      <LiveFeedback
        label={{
          failed: 'Payment failed',
          pending: 'Payment pending',
          success: 'Payment successful',
        }}
        state={buttonState}
        className="w-full"
      >
        <Button
          onClick={onClickPay}
          disabled={buttonState === 'pending'}
          size="lg"
          variant="primary"
          className="w-full"
        >
          Pay
        </Button>
      </LiveFeedback>
    </div>
  );
};
