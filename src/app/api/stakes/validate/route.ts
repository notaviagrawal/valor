import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, http, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { worldchain } from 'viem/chains';

// Minimal ABI for setResult(bytes32,bool)
const ESCROW_ABI = parseAbi([
    'function setResult(bytes32 stakeId, bool success) external',
]);

type Body = {
    stakeId: `0x${string}`;
    data?: unknown;
    price?: unknown;
};

export async function POST(req: NextRequest) {
    try {
        const { stakeId, data, price } = (await req.json()) as Body;

        if (!stakeId) {
            return NextResponse.json({ ok: false, error: 'Missing stakeId' }, { status: 400 });
        }

        const escrowAddress = process.env.NEXT_PUBLIC_ESCROW_ADDRESS as `0x${string}` | undefined;
        const adminPk = process.env.ESCROW_ADMIN_PRIVATE_KEY;
        const rpcUrl = process.env.WORLDCHAIN_RPC_URL || 'https://worldchain-mainnet.g.alchemy.com/public';

        if (!escrowAddress) {
            return NextResponse.json({ ok: false, error: 'Missing NEXT_PUBLIC_ESCROW_ADDRESS' }, { status: 500 });
        }
        if (!adminPk) {
            return NextResponse.json({ ok: false, error: 'Missing ESCROW_ADMIN_PRIVATE_KEY' }, { status: 500 });
        }

        const account = privateKeyToAccount(adminPk as `0x${string}`);
        const client = createWalletClient({ account, chain: worldchain, transport: http(rpcUrl) });

        // Dummy validation logic: if price within 5% of a target (e.g., 100), mark success
        // In real app, replace with Supabase fetch and comparison.
        const numericPrice = typeof price === 'string' ? Number(price) : typeof price === 'number' ? price : NaN;
        const target = 100; // demo target
        const success = Number.isFinite(numericPrice)
            ? Math.abs(numericPrice - target) / target <= 0.05
            : false;

        const hash = await client.writeContract({
            address: escrowAddress,
            abi: ESCROW_ABI,
            functionName: 'setResult',
            args: [stakeId, success],
        });

        return NextResponse.json({ ok: true, success, tx: hash });
    } catch (err: any) {
        return NextResponse.json({ ok: false, error: err?.message || 'Unknown error' }, { status: 500 });
    }
}