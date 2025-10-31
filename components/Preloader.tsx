"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  // Hide preloader after page load
  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 1000); // Optional delay for smooth fade-out
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  if (!loading) return null;

  return (
    <div className="top-0 left-0 z-9999 fixed flex justify-center items-center bg-black/20 backdrop-blur-xl w-screen h-screen font-sora loader [transition:_opacity_0.5s_ease-in-out]" id="preloader">
      <div className="flex flex-col items-center gap-4">
        <div className="mb-5 border-4 border-white border-t-transparent rounded-full w-12 h-12 animate-spin" />
        <p className="font-semibold text-white text-xl pulse-text loading-text"></p>
      </div>
    </div>
  );
}
