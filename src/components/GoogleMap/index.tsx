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

interface GoogleMapProps {
    apiKey: string;
}

const LocationMarkers = ({ locations }: { locations: Location[] }) => {
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

    const handleClick = useCallback((location: Location) => {
        if (!map) return;
        console.log('Location clicked:', location.name);
        map.panTo(location.location);
    }, [map]);

    return (
        <>
            {locations.map((location) => (
                <AdvancedMarker
                    key={location.id}
                    position={location.location}
                    ref={marker => setMarkerRef(marker, location.id)}
                    clickable={true}
                    onClick={() => handleClick(location)}
                >
                    <Pin
                        background={'#4285F4'}
                        glyphColor={'#fff'}
                        borderColor={'#fff'}
                        scale={1.2}
                    />
                </AdvancedMarker>
            ))}
        </>
    );
};

export default function GoogleMapComponent({ apiKey }: GoogleMapProps) {
    const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);

    // Debug logging
    console.log('API Key received:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined');
    console.log('Environment variable:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.substring(0, 10)}...` : 'undefined');

    // No need to fetch locations since we're not showing markers

    // Get user location on mount and every 15 seconds
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
                        const defaultLocation = { lat: -34.6037, lng: -58.3816 };
                        setCenter(defaultLocation);
                    }
                );
            } else {
                // Fallback to default location
                const defaultLocation = { lat: -34.6037, lng: -58.3816 };
                setCenter(defaultLocation);
            }
        };

        // Get location immediately
        getLocation();

        // Set up interval to get location every 15 seconds
        const interval = setInterval(getLocation, 15000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    const handleCameraChanged = useCallback((ev: MapCameraChangedEvent) => {
        const newCenter = ev.detail.center;
        if (newCenter) {
            setCenter({ lat: newCenter.lat, lng: newCenter.lng });
            // No need to fetch locations
        }
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
                </Map>
            )}
        </APIProvider>
    );
}
