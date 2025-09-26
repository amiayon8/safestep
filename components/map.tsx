// components/GoogleMap.tsx
"use client";

import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

type GpsData = {
  id: number;
  latitude: number;
  longitude: number;
  altitude: number | null;
  speed: number | null;
  course: number | null;
  satellites: number | null;
  hdop: number | null;
  gps_date: string | null; // ISO date string
  gps_time: string | null; // HH:MM:SS
  created_at: string; // ISO timestamp
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
    // ✅ Fetch last known GPS data first
    const fetchLastPosition = async () => {
      const { data, error } = await supabase
        .from("gps_data")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        const lastData = data as GpsData;
        if (lastData.latitude && lastData.longitude) {
          setPosition({ lat: lastData.latitude, lng: lastData.longitude });
          if (lastData.course !== null) setHeading(lastData.course);
        }
      }
    };

    fetchLastPosition();

    // ✅ Subscribe to realtime changes
    const channel = supabase
      .channel("gps_data_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "gps_data" },
        (payload) => {
          console.log("Change received!", payload);
          const newData = payload.new as GpsData;
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
