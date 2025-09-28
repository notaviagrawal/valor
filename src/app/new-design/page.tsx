'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import NewUI from '@/components/NewUI';
import LoginPage from '@/components/LoginPage';

export default function NewDesignPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        console.log('Session status:', status);
        console.log('Session data:', session);
        
        if (status === 'loading') return; // Still loading
        
        if (session) {
            console.log('User is authenticated, showing main UI');
            // User is authenticated, show main UI
            return;
        } else {
            console.log('User is not authenticated, showing login page');
            // User is not authenticated, show login page
            return;
        }
    }, [session, status]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#F4F4F8] font-inter flex items-center justify-center">
                <div className="text-center">
                    <div className="border-3 border-solid border-gray-200 border-t-[#333] rounded-full w-10 h-10 animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-inter">Loading...</p>
                </div>
            </div>
        );
    }

    if (session) {
        console.log('User is authenticated, showing main UI');
        return <NewUI />;
    }

    console.log('User is not authenticated, showing login page');
    return <LoginPage />;
}


