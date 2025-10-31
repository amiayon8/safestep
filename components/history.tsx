// components/GoogleMap.tsx
"use client";

import { useLoadScript, GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { LoadingMaps } from "./loading-maps";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

export default function MyMap() {
  const supabase = createClient();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // yyyy-mm-dd
  });

  const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
  const [center, setCenter] = useState({ lat: 23.8103, lng: 90.4125 });

  // Fetch GPS history for the selected day
  useEffect(() => {
    async function fetchHistory() {
      // Clear path immediately
      setPath([]);

      const start = `${selectedDate}T00:00:00`;
      const end = `${selectedDate}T23:59:59`;

      const { data, error } = await supabase
        .from("gps_data")
        .select("latitude, longitude, created_at")
        .gte("created_at", start)
        .lte("created_at", end)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching gps_data:", error);
        return;
      }

      if (data && data.length > 0) {
        const coords = data.map((row) => ({
          lat: row.latitude,
          lng: row.longitude,
        }));

        setPath(coords);
        setCenter(coords[0]); // focus map on first point
      }
    }

    fetchHistory();
  }, [selectedDate]);

  if (!isLoaded) return <LoadingMaps />;

  return (
    <div className="relative">
      {/* Date selector */}
      <div className="bottom-18 left-2 z-10 absolute bg-card rounded-lg cursor-pointer">
        <Input
          className="cursor-pointer"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <GoogleMap
        key={selectedDate}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={20}
        options={{
          zoomControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: 1,
            position: 1,
            mapTypeIds: ["roadmap", "satellite"],
          },
          cameraControlOptions: {
            position: 3,
          },

          rotateControl: false,
          scaleControl: true,
          clickableIcons: true,
          ...(isDark && { colorScheme: "DARK" }),
        }}
      >
        {/* Draw path if available */}
        {path.length > 1 && (
          <Polyline
            key={`poly-${selectedDate}-${path.length}`} // ✅ unique key per fetch
            path={path}
            options={{
              strokeColor: "blue",
              strokeOpacity: 0.7,
              strokeWeight: 4,
            }}
          />
        )}

        {/* Show markers for start and end */}
        {path.length > 0 && (
          <>
            <Marker
              key={`start-${selectedDate}-${path[0].lat}-${path[0].lng}`}
              position={path[0]}
              label="S"
            />
            <Marker
              key={`end-${selectedDate}-${path[path.length - 1].lat}-${path[path.length - 1].lng}`}
              position={path[path.length - 1]}
              label="E"
              
            />
          </>
        )}
      </GoogleMap>
    </div>
  );
}
