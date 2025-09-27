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

// Sample locations for demonstration
type Poi = { key: string, location: google.maps.LatLngLiteral };

const locations: Poi[] = [
    { key: 'operaHouse', location: { lat: -33.8567844, lng: 151.213108 } },
    { key: 'tarongaZoo', location: { lat: -33.8472767, lng: 151.2188164 } },
    { key: 'manlyBeach', location: { lat: -33.8209738, lng: 151.2563253 } },
    { key: 'hyderPark', location: { lat: -33.8690081, lng: 151.2052393 } },
    { key: 'theRocks', location: { lat: -33.8587568, lng: 151.2058246 } },
    { key: 'circularQuay', location: { lat: -33.858761, lng: 151.2055688 } },
    { key: 'harbourBridge', location: { lat: -33.852228, lng: 151.2038374 } },
    { key: 'kingsCross', location: { lat: -33.8737375, lng: 151.222569 } },
    { key: 'botanicGardens', location: { lat: -33.864167, lng: 151.216387 } },
    { key: 'museumOfSydney', location: { lat: -33.8636005, lng: 151.2092542 } },
    { key: 'maritimeMuseum', location: { lat: -33.869395, lng: 151.198648 } },
    { key: 'kingStreetWharf', location: { lat: -33.8665445, lng: 151.1989808 } },
    { key: 'aquarium', location: { lat: -33.869627, lng: 151.202146 } },
    { key: 'darlingHarbour', location: { lat: -33.87488, lng: 151.1987113 } },
    { key: 'barangaroo', location: { lat: -33.8605523, lng: 151.1972205 } },
];

const PoiMarkers = (props: { pois: Poi[] }) => {
    const map = useMap();
    const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
    const clusterer = useRef<MarkerClusterer | null>(null);

    // Initialize MarkerClusterer, if the map has changed
    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        }
    }, [map]);

    // Update markers, if the markers array has changed
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

    const handleClick = useCallback((ev: google.maps.MapMouseEvent) => {
        if (!map) return;
        if (!ev.latLng) return;
        console.log('marker clicked:', ev.latLng.toString());
        map.panTo(ev.latLng);
    }, [map]);

    return (
        <>
            {props.pois.map((poi: Poi) => (
                <AdvancedMarker
                    key={poi.key}
                    position={poi.location}
                    ref={marker => setMarkerRef(marker, poi.key)}
                    clickable={true}
                    onClick={handleClick}
                >
                    <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
            ))}
        </>
    );
};

interface GoogleMapProps {
    apiKey: string;
}

export default function GoogleMapComponent({ apiKey }: GoogleMapProps) {
    // Debug logging
    console.log('API Key received:', apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined');
    console.log('Environment variable:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.substring(0, 10)}...` : 'undefined');

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
            <Map
                defaultZoom={13}
                defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
                mapId="3713b663965620613d3040ef"
                gestureHandling="greedy"
                disableDefaultUI={true}
                zoomControl={false}
                mapTypeControl={false}
                scaleControl={false}
                streetViewControl={false}
                rotateControl={false}
                fullscreenControl={false}
                onCameraChanged={(ev: MapCameraChangedEvent) =>
                    console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                }
                className="h-full w-full"
            >
                <PoiMarkers pois={locations} />
            </Map>
        </APIProvider>
    );
}
