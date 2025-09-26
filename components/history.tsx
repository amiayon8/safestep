// components/GoogleMap.tsx
"use client";

import { useLoadScript, GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { useState, useEffect } from "react";
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

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div>
      {/* Date selector */}
      <div className="bottom-8 left-2 z-10 absolute bg-white shadow-md rounded cursor-pointer">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-2 py-1 border rounded"
        />
      </div>

      <GoogleMap
        key={selectedDate} // ✅ Force a fresh map render on date change
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
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
              label="Start"
            />
            <Marker
              key={`end-${selectedDate}-${path[path.length - 1].lat}-${path[path.length - 1].lng}`}
              position={path[path.length - 1]}
              label="End"
            />
          </>
        )}
      </GoogleMap>
    </div>
  );
}
