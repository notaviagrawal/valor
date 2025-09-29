import { NextRequest, NextResponse } from 'next/server';
import { MiniAppPaymentSuccessPayload } from '@worldcoin/minikit-js';


export async function POST(req: NextRequest) {
    const payload = (await req.json()) as MiniAppPaymentSuccessPayload;

    // IMPORTANT: Here we should fetch the reference you created in /initiate-payment to ensure the transaction we are verifying is the same one we initiated
    // For now, we'll just return success since we don't have a database
    // In production, you should store the reference ID and verify it matches

    try {
        // 1. Check that the transaction we received from the mini app is the same one we sent
        if (payload.reference) {
            // 2. Here we optimistically confirm the transaction.
            // In production, you should call the Developer Portal API to verify the transaction
            // const response = await fetch(
            //   `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.APP_ID}`,
            //   {
            //     method: 'GET',
            //     headers: {
            //       Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
            //     },
            //   }
            // );
            // const transaction = await response.json();

            // For now, we'll just return success if we have a reference
            return NextResponse.json({ success: true, reference: payload.reference });
        } else {
            return NextResponse.json({ success: false, error: 'No reference provided' });
        }
    } catch (error) {
        console.error('Payment confirmation error:', error);
        return NextResponse.json({ success: false, error: 'Payment confirmation failed' });
    }
}
