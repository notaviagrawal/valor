'use client';

import React, { useEffect, useRef } from 'react';

interface BottomDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
    storeData?: {
        name: string;
        rating?: number;
        priceLevel?: number;
        vicinity?: string;
        photos?: any[];
        place_id?: string;
        types?: string[];
        distance?: number;
        geometry?: {
            location: {
                lat(): number;
                lng(): number;
            };
        };
    };
}

export default function BottomDrawer({ isOpen, onClose, title, children, storeData }: BottomDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);

    // Helper function to get the correct icon based on store type
    const getStoreIcon = (store: any) => {
        if (store?.types?.includes('gas_station')) {
            return "https://img.icons8.com/3d-fluency/94/gas-station.png";
        }
        return "https://img.icons8.com/3d-fluency/50/ingredients.png";
    };

    // Handle Google Maps navigation
    const handleGoogleMaps = () => {
        if (storeData?.geometry?.location) {
            const lat = storeData.geometry.location.lat();
            const lng = storeData.geometry.location.lng();

            // Check if we're on mobile
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (isMobile) {
                // For mobile, try to open in native maps app first
                const mapsUrl = `maps://maps.google.com/maps?daddr=${lat},${lng}`;
                const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

                // Try to open in native app, fallback to web
                window.location.href = mapsUrl;
                setTimeout(() => {
                    window.open(fallbackUrl, '_blank');
                }, 1000);
            } else {
                // For desktop, open in new tab
                const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                window.open(url, '_blank');
            }
        }
    };

    // Handle Enter Price action
    const handleEnterPrice = () => {
        // TODO: Implement price entry functionality
        console.log('Enter price for:', storeData?.name);
    };

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Handle swipe down to close
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        const startY = touch.clientY;
        const startTime = Date.now();

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            const currentY = touch.clientY;
            const deltaY = currentY - startY;
            const currentTime = Date.now();
            const deltaTime = currentTime - startTime;

            // If swiping down fast enough, close the drawer
            if (deltaY > 100 && deltaTime < 300) {
                onClose();
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            }
        };

        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop/Scrim */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-out"
                style={{
                    paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)',
                    transform: isOpen ? 'translateY(0)' : 'translateY(100%)'
                }}
                onTouchStart={handleTouchStart}
            >
                <div className="bg-white rounded-t-3xl shadow-lg mx-4 mb-4" style={{ boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)' }}>
                    {/* Handle bar */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-500">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {/* Content */}
                    <div className="px-5 pt-2 pb-8">
                        {/* Title with icon and distance */}
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                <img
                                    src={getStoreIcon(storeData)}
                                    alt={storeData?.types?.includes('gas_station') ? "Gas Station" : "Grocery Store"}
                                    className="w-7 h-7"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-black font-system">
                                    {title}
                                </h2>
                                {storeData?.distance && (
                                    <p className="text-sm text-gray-500">
                                        {storeData.distance.toFixed(1)} Miles away
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Custom content */}
                        {children && (
                            <div className="mb-4">
                                {children}
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex space-x-3 mt-4">
                            <button
                                onClick={handleGoogleMaps}
                                className="w-12 h-12 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center flex-shrink-0"
                            >
                                <img
                                    src="https://img.icons8.com/3d-fluency/94/map-marker.png"
                                    alt="Map Marker"
                                    className="w-6 h-6"
                                />
                            </button>
                            <button
                                onClick={handleEnterPrice}
                                className="flex-1 bg-green-500 text-white font-semibold text-base py-3 rounded-full hover:bg-green-600 transition-colors"
                            >
                                Enter Price
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
