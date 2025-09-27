import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        const radius = searchParams.get('radius') || '1000'; // Default 1km radius
        const type = searchParams.get('type') || 'restaurant'; // Default to restaurants

        if (!lat || !lng) {
            return NextResponse.json(
                { error: 'Latitude and longitude are required' },
                { status: 400 }
            );
        }

        // Use Google Places API to find nearby locations
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Google Maps API key not configured' },
                { status: 500 }
            );
        }

        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;

        const response = await fetch(placesUrl);
        const data = await response.json();

        if (data.status !== 'OK') {
            return NextResponse.json(
                { error: 'Failed to fetch locations from Google Places API' },
                { status: 500 }
            );
        }

        // Transform the data to a cleaner format
        const locations = data.results.map((place: any) => ({
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            location: {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng
            },
            rating: place.rating,
            priceLevel: place.price_level,
            types: place.types,
            photos: place.photos?.map((photo: any) => ({
                reference: photo.photo_reference,
                width: photo.width,
                height: photo.height
            })) || []
        }));

        return NextResponse.json({
            success: true,
            locations,
            nextPageToken: data.next_page_token
        });

    } catch (error) {
        console.error('Location API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, address, lat, lng, type = 'custom' } = body;

        if (!name || !lat || !lng) {
            return NextResponse.json(
                { error: 'Name, latitude, and longitude are required' },
                { status: 400 }
            );
        }

        // Here you would typically save to a database
        // For now, we'll just return the created location
        const location = {
            id: `custom_${Date.now()}`,
            name,
            address: address || '',
            location: { lat: parseFloat(lat), lng: parseFloat(lng) },
            type,
            createdAt: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            location
        }, { status: 201 });

    } catch (error) {
        console.error('Create location error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
