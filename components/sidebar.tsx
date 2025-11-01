"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  IconAlertHexagonFilled,
  IconLiveViewFilled,
  IconMapPinFilled,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import Footer from "@/components/footer";
import ThemeToggle from "./theme-toggle";


export default function Sidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // closed by default on mobile
  const [isOpen, setIsOpen] = useState(false);

  // track client mount to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarItems = [
    { name: "Live Location", icon: IconLiveViewFilled, url: "/" },
    { name: "Location History", icon: IconMapPinFilled, url: "/history" },
    { name: "SOS History", icon: IconAlertHexagonFilled, url: "/sos-history" },
  ];

  // skeleton while mounting
  if (!mounted) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="flex flex-col gap-2 bg-sidebar p-4 w-72 animate-pulse">
          <div className="bg-background/50 mb-4 rounded-md w-3/4 h-10"></div>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-background/50 rounded-md w-full h-8"></div>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-background min-h-screen"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <motion.div
          initial={{ x: "0%" }}
          animate={{ x: isOpen ? 0 : "-100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="top-0 left-0 z-50 fixed flex flex-col bg-sidebar shadow-lg w-72 h-[100dvh] text-sidebar-foreground"
        >
          <div className="flex justify-between items-center p-4 font-logo font-bold text-xl">
            <span>Vision+</span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="sm:hidden hover:bg-primary/10 px-3 py-2 rounded-lg text-foreground"
            >
              <IconX />
            </button>
          </div>

          <nav className="flex flex-col gap-1 py-6 min-w-[240px] overflow-auto font-sans font-normal text-base">
            {sidebarItems.map(({ name, icon: Icon, url }) => {
              const active =
                pathname === url || (url !== "/" && pathname.startsWith(url));

              return (
                <Link
                  key={url}
                  href={url}
                  className={`flex items-center gap-3 px-6 py-4 transition-colors text-sm ${active
                    ? "bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                    : "hover:bg-background/50"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{name}</span>
                </Link>
              );
            })}
          </nav>
        </motion.div>

        {/* Page content */}
        <motion.div
          animate={{ marginLeft: isOpen ? "18rem" : "0rem" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="flex flex-col flex-1 min-h-screen"
        >
          {/* Top Navbar */}
          <header className="flex justify-between items-center bg-sidebar shadow-sm px-4 h-14 text-sidebar-foreground">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`hover:bg-primary/10 px-3 py-2 rounded-lg text-foreground ${isOpen ? "hidden" : "block"
                } sm:block`}
            >
              <IconMenu2 />
            </button>
            <div className="flex items-center gap-4 ml-auto">
              <ThemeToggle></ThemeToggle>
            </div>
          </header>

          <main className="flex flex-col flex-1 h-full overflow-auto">
            {children}
            <Footer />
          </main>
        </motion.div>
      </div >
    </>
  );
}
