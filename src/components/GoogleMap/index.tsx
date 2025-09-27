'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    MapCameraChangedEvent,
    useMap,
    Pin
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';
import BottomDrawer from '../BottomDrawer';

// Google Maps API types
declare global {
    interface Window {
        google: any;
    }
}

interface Location {
    id: string;
    name: string;
    address: string;
    location: {
        lat: number;
        lng: number;
    };
    rating?: number;
    priceLevel?: number;
    types?: string[];
}

interface GroceryStore {
    place_id: string;
    name: string;
    geometry: {
        location: {
            lat(): number;
            lng(): number;
        };
    };
    rating?: number;
    price_level?: number;
    vicinity?: string;
    photos?: any[];
    types?: string[];
}

interface GoogleMapProps {
    apiKey: string;
}

const GroceryStoreMarkers = ({ stores, onStoreClick }: { stores: GroceryStore[], onStoreClick: (store: GroceryStore) => void }) => {
    const map = useMap();
    const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
    const clusterer = useRef<MarkerClusterer | null>(null);

    // Initialize MarkerClusterer
    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        }
    }, [map]);

    // Update markers
    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);

    const setMarkerRef = (marker: Marker | null, key: string) => {
        if (marker && markers[key]) return;
        if (!marker && !markers[key]) return;

        setMarkers(prev => {
            if (marker) {
                return { ...prev, [key]: marker };
            } else {
                const newMarkers = { ...prev };
                delete newMarkers[key];
                return newMarkers;
            }
        });
    };

    const handleClick = useCallback((store: GroceryStore) => {
        if (!map) return;
        console.log('Grocery store clicked:', store.name);

        // Pan to store location
        map.panTo({
            lat: store.geometry.location.lat(),
            lng: store.geometry.location.lng()
        });

        // Open drawer
        onStoreClick(store);
    }, [map, onStoreClick]);

    return (
        <>
            {stores.map((store) => (
                <AdvancedMarker
                    key={store.place_id}
                    position={{
                        lat: store.geometry.location.lat(),
                        lng: store.geometry.location.lng()
                    }}
                    ref={marker => setMarkerRef(marker, store.place_id)}
                    clickable={true}
                    onClick={() => handleClick(store)}
                >
                    <Pin
                        background={'#34A853'}
                        glyphColor={'#fff'}
                        borderColor={'#fff'}
                        scale={1.0}
                    />
                </AdvancedMarker>
            ))}
        </>
    );
};

export default function GoogleMapComponent({ apiKey }: GoogleMapProps) {
    const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
    const [groceryStores, setGroceryStores] = useState<GroceryStore[]>([]);
    const [isLoadingStores, setIsLoadingStores] = useState(false);
    const lastFetchRef = useRef<{ lat: number; lng: number; zoom: number } | null>(null);

    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState<GroceryStore | null>(null);

    // Debug logging
    console.log('API Key received:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined');
    console.log('Environment variable:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.substring(0, 10)}...` : 'undefined');

    // Calculate radius based on zoom level
    const calculateRadius = (zoom: number): number => {
        // Rough calculation: higher zoom = smaller radius
        const baseRadius = 10000; // 10km base
        const zoomFactor = Math.pow(2, 15 - zoom); // Adjust based on zoom level
        return Math.max(1000, baseRadius / zoomFactor); // Minimum 1km radius
    };

    // Fetch grocery stores using Google Places API
    const fetchGroceryStores = useCallback(async (location: { lat: number; lng: number }, zoom: number) => {
        if (!window.google || !window.google.maps || !window.google.maps.places) {
            console.error('Google Maps API not loaded');
            return;
        }

        setIsLoadingStores(true);

        try {
            const service = new window.google.maps.places.PlacesService(
                document.createElement('div')
            );

            const request = {
                location: new window.google.maps.LatLng(location.lat, location.lng),
                type: 'grocery_or_supermarket',
                rankBy: window.google.maps.places.RankBy.DISTANCE
            };

            service.nearbySearch(request, (results: any, status: any) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                    setGroceryStores(results.slice(0, 20)); // Limit to 20 stores
                    console.log(`Found ${results.length} grocery stores`);
                } else {
                    console.error('Places API error:', status);
                    setGroceryStores([]);
                }
                setIsLoadingStores(false);
            });
        } catch (error) {
            console.error('Error fetching grocery stores:', error);
            setGroceryStores([]);
            setIsLoadingStores(false);
        }
    }, []);

    // Get user location on mount
    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        setCenter(userLocation);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        // Fallback to default location
                        const defaultLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco
                        setCenter(defaultLocation);
                    }
                );
            } else {
                // Fallback to default location
                const defaultLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco
                setCenter(defaultLocation);
            }
        };

        getLocation();
    }, []);

    const handleCameraChanged = useCallback((ev: MapCameraChangedEvent) => {
        const newCenter = ev.detail.center;
        const newZoom = ev.detail.zoom;

        if (newCenter && newZoom) {
            setCenter({ lat: newCenter.lat, lng: newCenter.lng });

            // Only fetch if we've moved significantly or zoomed significantly
            const lastFetch = lastFetchRef.current;
            if (!lastFetch ||
                Math.abs(newCenter.lat - lastFetch.lat) > 0.01 ||
                Math.abs(newCenter.lng - lastFetch.lng) > 0.01 ||
                Math.abs(newZoom - lastFetch.zoom) > 1) {

                lastFetchRef.current = { lat: newCenter.lat, lng: newCenter.lng, zoom: newZoom };
                fetchGroceryStores({ lat: newCenter.lat, lng: newCenter.lng }, newZoom);
            }
        }
    }, [fetchGroceryStores]);

    // Calculate distance between two points
    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
        const R = 3959; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Drawer handlers
    const handleStoreClick = useCallback((store: GroceryStore) => {
        setSelectedStore(store);
        setIsDrawerOpen(true);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
        setSelectedStore(null);
    }, []);

    if (!apiKey || apiKey === 'your_api_key_here') {
        return (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
                <div className="text-center p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Google Maps API Key Required</h3>
                    <p className="text-gray-600 mb-4">
                        Please add your Google Maps API key to the environment variables.
                    </p>
                    <p className="text-sm text-gray-500">
                        Create a .env.local file with: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key
                    </p>
                    <p className="text-xs text-red-500 mt-2">
                        Debug: API Key = {apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <APIProvider
            apiKey={apiKey}
            onLoad={() => console.log('Maps API has loaded.')}
            onError={(error) => console.error('Maps API Error:', error)}
        >
            {center && (
                <Map
                    defaultZoom={13}
                    defaultCenter={center}
                    mapId="31053bcd540af9d8ebbb6e83"
                    gestureHandling="greedy"
                    disableDefaultUI={true}
                    zoomControl={false}
                    mapTypeControl={false}
                    scaleControl={false}
                    streetViewControl={false}
                    rotateControl={false}
                    fullscreenControl={false}
                    onCameraChanged={handleCameraChanged}
                    className="h-full w-full"
                >
                    {/* Grocery Store Markers */}
                    {groceryStores.length > 0 && (
                        <GroceryStoreMarkers stores={groceryStores} onStoreClick={handleStoreClick} />
                    )}

                    {/* Loading indicator */}
                    {isLoadingStores && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                                <span className="text-sm text-gray-700">Loading grocery stores...</span>
                            </div>
                        </div>
                    )}
                </Map>
            )}

            {/* Bottom Drawer */}
            <BottomDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                title={selectedStore?.name || 'Store'}
                storeData={selectedStore ? {
                    name: selectedStore.name,
                    rating: selectedStore.rating,
                    priceLevel: selectedStore.price_level,
                    vicinity: selectedStore.vicinity,
                    photos: selectedStore.photos,
                    place_id: selectedStore.place_id,
                    types: selectedStore.types,
                    distance: center ? calculateDistance(
                        center.lat,
                        center.lng,
                        selectedStore.geometry.location.lat(),
                        selectedStore.geometry.location.lng()
                    ) : 0,
                    geometry: selectedStore.geometry
                } : undefined}
            />
        </APIProvider>
    );
}
