// components/GoogleMap.tsx
"use client";

import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const containerStyle = {
    width: "100%",
    height: "100vh",
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MyMap() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    });

    const [position, setPosition] = useState({ lat: 23.8103, lng: 90.4125 });
    const [heading, setHeading] = useState(0);

    useEffect(() => {
        // ✅ Subscribe to realtime changes in the gps_data table
        const channel = supabase
            .channel("gps_data_changes")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "gps_data" },
                (payload) => {
                    const newData = payload.new as any;
                    if (newData.latitude && newData.longitude) {
                        setPosition({ lat: newData.latitude, lng: newData.longitude });
                        if (newData.course !== null) setHeading(newData.course);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (!isLoaded) return <p>Loading map...</p>;

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={20}
            options={{
                zoomControl: true,
                streetViewControl: false,
                fullscreenControl: true,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: 1,
                    position: 3,
                    mapTypeIds: ["roadmap", "satellite"],
                },
                rotateControl: false,
                scaleControl: true,
                clickableIcons: true,
            }}
        >
            <Marker
                position={position}
                icon={{
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 8,
                    rotation: heading,
                    fillColor: "blue",
                    fillOpacity: 1,
                    strokeColor: "white",
                    strokeWeight: 2,
                }}
            />
        </GoogleMap>
    );
}
