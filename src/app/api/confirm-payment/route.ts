import { NextRequest, NextResponse } from 'next/server';
import { MiniAppPaymentSuccessPayload } from '@worldcoin/minikit-js';

export async function POST(req: NextRequest) {
    const payload = (await req.json()) as MiniAppPaymentSuccessPayload;

    try {
        if (payload.reference) {
            return NextResponse.json({ success: true, reference: payload.reference });
        }

        return NextResponse.json({ success: false, error: 'No reference provided' });
    } catch (error) {
        console.error('Payment confirmation error:', error);
        return NextResponse.json({ success: false, error: 'Payment confirmation failed' });
    }
}

