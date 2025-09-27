'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import GoogleMapComponent from '../GoogleMap';

export default function NewUI() {
    const [activeTab, setActiveTab] = useState('home');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchValue, setSearchValue] = useState('');

    // Handle search focus and blur
    useEffect(() => {
        if (searchInputRef.current && isSearchExpanded) {
            searchInputRef.current.focus();
        }
    }, [isSearchExpanded]);

    // Reset search when switching tabs
    useEffect(() => {
        setIsSearchExpanded(false);
        setSearchValue('');
    }, [activeTab]);

    // Handle click outside to close search
    const handleClickOutside = (e: React.MouseEvent) => {
        if (isSearchExpanded && e.target === e.currentTarget) {
            // Close search smoothly
            setSearchValue('');
            setTimeout(() => {
                setIsSearchExpanded(false);
            }, 100);
        }
    };

    // Handle search submit
    const handleSearchSubmit = () => {
        if (searchValue.trim()) {
            // Handle search logic here
            console.log('Searching for:', searchValue);
        }
        setIsSearchExpanded(false);
        setSearchValue('');
    };

    // Handle keyboard events
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        } else if (e.key === 'Escape') {
            setSearchValue('');
            setTimeout(() => {
                setIsSearchExpanded(false);
            }, 100);
        }
    };

    // Handle iOS Done button
    const handleInputBlur = () => {
        if (isSearchExpanded) {
            setSearchValue('');
            setTimeout(() => {
                setIsSearchExpanded(false);
            }, 100);
        }
    };

    const renderContent = () => {
        if (showProfile) {
            return (
                <div className="min-h-screen bg-[#F0F2F5] font-inter flex flex-col">
                    {/* Header */}
                    <div className="px-4 pt-4 pb-4">
                        <div className="flex items-center justify-between">
                            {/* Back Button */}
                            <div
                                className="w-11 h-11 flex items-center justify-center cursor-pointer bg-[#E9E9EB] rounded-full"
                                onClick={() => setShowProfile(false)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#1C1C1E]">
                                    <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            {/* Title */}
                            <h1 className="text-lg font-semibold text-[#1C1C1E] font-inter">Profile</h1>

                            {/* Empty space for balance */}
                            <div className="w-11 h-11"></div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="flex-1 bg-white rounded-t-3xl">
                        <div className="px-6 pt-6">
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-gray-500">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-[#1C1C1E] font-inter">John Doe</h2>
                                <p className="text-gray-600 text-sm font-inter">john.doe@example.com</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: 'Personal Information', icon: '👤' },
                                    { title: 'Payment Methods', icon: '💳' },
                                    { title: 'Order History', icon: '📦' },
                                    { title: 'Settings', icon: '⚙️' },
                                    { title: 'Help & Support', icon: '❓' }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xl">{item.icon}</span>
                                            <span className="font-medium text-[#1C1C1E] font-inter">{item.title}</span>
                                        </div>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (showNotifications) {
            return (
                <div className="min-h-screen bg-[#F0F2F5] font-inter flex flex-col">
                    {/* Header */}
                    <div className="px-4 pt-4 pb-4">
                        <div className="flex items-center justify-between">
                            {/* Back Button */}
                            <div
                                className="w-11 h-11 flex items-center justify-center cursor-pointer bg-[#E9E9EB] rounded-full"
                                onClick={() => setShowNotifications(false)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#1C1C1E]">
                                    <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            {/* Title */}
                            <h1 className="text-lg font-semibold text-[#1C1C1E] font-inter">Notifications</h1>

                            {/* Empty space for balance */}
                            <div className="w-11 h-11"></div>
                        </div>
                    </div>

                    {/* Notifications Content */}
                    <div className="flex-1 bg-white rounded-t-3xl">
                        <div className="px-6 pt-6">
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <div key={item} className="bg-gray-50 rounded-2xl p-4 cursor-pointer hover:bg-gray-100 transition-colors">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                                                    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-[#1C1C1E] text-sm font-inter">New notification {item}</h3>
                                                <p className="text-gray-600 text-xs font-inter mt-1">You have a new message from the system</p>
                                                <p className="text-gray-400 text-xs font-inter mt-1">{item} hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        switch (activeTab) {
            case 'map':
                return (
                    <div className="h-screen w-full relative overflow-hidden">
                        {/* Google Maps - Full screen background */}
                        <div className="absolute inset-0">
                            <GoogleMapComponent apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'your_api_key_here'} />
                        </div>

                        {/* Blur overlay when search is expanded */}
                        {isSearchExpanded && (
                            <div
                                className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10"
                                onClick={handleClickOutside}
                            />
                        )}

                        {/* Floating Header - Overlay on top of map */}
                        <div className="absolute top-0 left-0 right-0 px-6 pt-12 pb-6 z-20">
                            <div className="flex items-center justify-between">
                                {/* Search Container - Fixed height to prevent layout shifts */}
                                <div className="flex-1 mr-4">
                                    <div className="relative h-10">
                                        <div
                                            className={`flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 cursor-pointer transition-all duration-500 ease-in-out hover:bg-white/30 absolute top-0 z-30 ${isSearchExpanded
                                                ? 'w-full rounded-full px-4 py-2 h-10'
                                                : 'w-10 h-10 rounded-full'
                                                }`}
                                            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                                        >
                                            {!isSearchExpanded ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-black flex-shrink-0">
                                                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M20.9999 21.0004L16.6499 16.6504" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-black flex-shrink-0">
                                                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M20.9999 21.0004L16.6499 16.6504" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}

                                            {/* Search Input */}
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                placeholder="Search..."
                                                value={searchValue}
                                                onChange={(e) => setSearchValue(e.target.value)}
                                                onKeyDown={handleKeyPress}
                                                onBlur={handleInputBlur}
                                                className={`bg-transparent text-white placeholder-white/70 outline-none transition-all duration-500 ease-in-out ${isSearchExpanded
                                                    ? 'w-full ml-4 opacity-100'
                                                    : 'w-0 ml-0 opacity-0'
                                                    }`}
                                            />

                                            {/* Submit button when expanded */}
                                            {isSearchExpanded && (
                                                <button
                                                    onClick={handleSearchSubmit}
                                                    className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-black">
                                                        <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Icon - Standardized positioning */}
                                <div className="w-10 h-10 flex items-center justify-center cursor-pointer relative z-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-full" onClick={() => setShowProfile(true)}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-black">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'wallet':
                return (
                    <div className="h-screen bg-[#F4F4F8] font-inter flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="px-6 pt-12 pb-6 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                {/* Notifications Icon - Using World UI Kit styling */}
                                <div
                                    className="w-10 h-10 flex items-center justify-center cursor-pointer bg-white/20 backdrop-blur-md border border-white/30 rounded-full"
                                    onClick={() => setShowNotifications(true)}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-black">
                                        <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                {/* Profile Icon - Standardized positioning */}
                                <div className="w-10 h-10 flex items-center justify-center cursor-pointer bg-white/20 backdrop-blur-md border border-white/30 rounded-full" onClick={() => setShowProfile(true)}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-black">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Wallet Content - Completely non-scrollable */}
                        <div className="flex-1 px-6 flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-[#1C1C1E] mb-4 font-inter">Wallet</h1>
                                <p className="text-gray-600 font-inter">Wallet content will be displayed here</p>
                            </div>
                        </div>
                    </div>
                );

            default: // home
                return (
                    <div className="min-h-screen bg-[#F4F4F8] font-inter flex flex-col relative overflow-y-auto">
                        {/* Blur overlay when search is expanded */}
                        {isSearchExpanded && (
                            <div
                                className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10"
                                onClick={handleClickOutside}
                            />
                        )}

                        {/* Header */}
                        <div className="px-6 pt-12 pb-6 relative z-20">
                            <div className="flex items-center justify-between">
                                {/* Search Container - Fixed height to prevent layout shifts */}
                                <div className="flex-1 mr-4">
                                    <div className="relative h-10">
                                        <div
                                            className={`flex items-center justify-center bg-white/20 backdrop-blur-md border border-slate-800 cursor-pointer transition-all duration-500 ease-in-out hover:bg-white/30 absolute top-0 z-30 ${isSearchExpanded
                                                ? 'w-full rounded-full px-4 py-2 h-10'
                                                : 'w-10 h-10 rounded-full'
                                                }`}
                                            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                                        >
                                            {!isSearchExpanded ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-black flex-shrink-0">
                                                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M20.9999 21.0004L16.6499 16.6504" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-black flex-shrink-0">
                                                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M20.9999 21.0004L16.6499 16.6504" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}

                                            {/* Search Input */}
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                placeholder="Search..."
                                                value={searchValue}
                                                onChange={(e) => setSearchValue(e.target.value)}
                                                onKeyDown={handleKeyPress}
                                                onBlur={handleInputBlur}
                                                className={`bg-transparent text-black placeholder-gray-500 outline-none transition-all duration-500 ease-in-out ${isSearchExpanded
                                                    ? 'w-full ml-4 opacity-100'
                                                    : 'w-0 ml-0 opacity-0'
                                                    }`}
                                            />

                                            {/* Submit button when expanded */}
                                            {isSearchExpanded && (
                                                <button
                                                    onClick={handleSearchSubmit}
                                                    className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-black">
                                                        <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Icon - Standardized positioning */}
                                <div className="w-10 h-10 flex items-center justify-center cursor-pointer relative z-20 bg-white/20 backdrop-blur-md border border-white/30 rounded-full" onClick={() => setShowProfile(true)}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-black">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Category Pills - Horizontal Scroll */}
                        <div className="px-6 pb-6">
                            <div className="flex gap-3 overflow-x-auto overflow-y-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {[
                                    { name: 'Banana', icon: '🍌' },
                                    { name: 'Beef', icon: '🥩' },
                                    { name: 'Gas', icon: '⛽' },
                                    { name: 'Bread', icon: '🍞' },
                                    { name: 'Rice', icon: '🍚' },
                                    { name: 'Money', icon: '💰' }
                                ].map((category, index) => (
                                    <div
                                        key={category.name}
                                        className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 cursor-pointer font-inter flex items-center gap-2 flex-shrink-0 ${index === 0
                                            ? 'bg-[#1C1C1E] text-white'
                                            : 'bg-[#E0E0E0] text-[#1C1C1E]'
                                            }`}
                                    >
                                        <span className="text-base">{category.icon}</span>
                                        {category.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Super Markets Section - Horizontal Scroll */}
                        <div className="px-6 pb-6">
                            <h2 className="text-2xl font-bold text-[#1C1C1E] mb-4 font-inter">Super Markets</h2>
                            <div className="flex gap-4 overflow-x-auto overflow-y-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {[
                                    { name: 'Whole Foods', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop' },
                                    { name: 'Trader Joe\'s', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
                                    { name: 'Safeway', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop' },
                                    { name: 'Kroger', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop' },
                                    { name: 'Target', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop' },
                                    { name: 'Walmart', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' }
                                ].map((store, index) => (
                                    <div key={index} className="relative group cursor-pointer flex-shrink-0">
                                        <div className="relative w-[280px] h-[200px] rounded-2xl overflow-hidden">
                                            <img
                                                src={store.image}
                                                alt={store.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-3 left-3">
                                                <h3 className="text-lg font-bold text-white font-inter">{store.name}</h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gas Section - Horizontal Scroll */}
                        <div className="px-6 pb-6">
                            <h2 className="text-2xl font-bold text-[#1C1C1E] mb-4 font-inter">Gas</h2>
                            <div className="flex gap-4 overflow-x-auto overflow-y-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                {[
                                    { name: 'Shell', image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop' },
                                    { name: 'BP', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=200&fit=crop' },
                                    { name: 'Exxon', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
                                    { name: 'Chevron', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop' },
                                    { name: 'Mobil', image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop' },
                                    { name: 'Texaco', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=200&fit=crop' }
                                ].map((station, index) => (
                                    <div key={index} className="relative group cursor-pointer flex-shrink-0">
                                        <div className="relative w-[280px] h-[200px] rounded-2xl overflow-hidden">
                                            <img
                                                src={station.image}
                                                alt={station.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-3 left-3">
                                                <h3 className="text-lg font-bold text-white font-inter">{station.name}</h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Spacing for Tab Bar */}
                        <div className="h-8"></div>
                    </div>
                );
        }
    };

    return (
        <>
            <style jsx>{`
                /* Hide all scrollbars completely */
                * {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                *::-webkit-scrollbar {
                    display: none;
                }
                
                /* Ensure no scrollbars on horizontal containers */
                .overflow-x-auto {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .overflow-x-auto::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <div className="min-h-screen bg-[#F4F4F8] font-inter flex flex-col">
                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto pb-20 overflow-x-hidden">
                    {renderContent()}
                </div>

                {/* Bottom Tab Navigation */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
                    <div className="flex items-center justify-around py-3 px-6">
                        <div
                            className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'map' ? 'text-[#1C1C1E]' : 'text-gray-400'
                                }`}
                            onClick={() => {
                                setActiveTab('map');
                                setIsSearchExpanded(false);
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                                <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <div
                            className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'home' ? 'text-[#1C1C1E]' : 'text-gray-400'
                                }`}
                            onClick={() => {
                                setActiveTab('home');
                                setIsSearchExpanded(false);
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <div
                            className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'wallet' ? 'text-[#1C1C1E]' : 'text-gray-400'
                                }`}
                            onClick={() => {
                                setActiveTab('wallet');
                                setIsSearchExpanded(false);
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* 12px white buffer underneath navigation icons */}
                    <div className="w-full h-3 bg-white"></div>
                </div>
            </div>
        </>
    );
}