"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function SosToast() {
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel("sos_data_changes")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "sos" },
                () => {
                    toast.error("Vision+ User is in Danger!");
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div></div>
    );
}
