"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "./ui/card";
import { IconHeartbeat, IconLeaf, IconRun } from "@tabler/icons-react";
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client";

type HRData = {
    id: number;
    pulse_rate: number | null;
    blood_oxygen: number | null;
    created_at: string; // ISO timestamp
};

export default function DashStats({ className, ...props }: React.ComponentProps<"div">) {

    const supabase = createClient();

    const [health_data, setData] = useState({ blood_oxygen: 98.90, pulse_rate: 101 });

    useEffect(() => {
        // Fetch last known HEALTH data first
        const fetchLastData = async () => {
            const { data, error } = await supabase
                .from("health")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (!error && data) {
                const lastData = data as HRData;
                if (lastData.blood_oxygen !== null && lastData.pulse_rate !== null) {
                    setData({
                        blood_oxygen: lastData.blood_oxygen,
                        pulse_rate: lastData.pulse_rate,
                    });
                }
            }
        };

        fetchLastData();

        // Subscribe to realtime changes
        const channel = supabase
            .channel("health_changes")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "health" },
                (payload) => {
                    const newData = payload.new as HRData;
                    if (newData.blood_oxygen !== null && newData.pulse_rate !== null) {
                        setData({
                            blood_oxygen: newData.blood_oxygen,
                            pulse_rate: newData.pulse_rate,
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className={cn("gap-3 grid grid-cols-2 font-nimbus", className)} {...props}>
            <Card>
                <CardContent className="space-y-2">
                    <div className="flex flex-row justify-start items-center gap-2">
                        <span className="bg-primary p-1 rounded-full aspect-square text-primary-foreground">
                            <IconHeartbeat className="stroke-[2.5] size-4" />
                        </span>
                        <span className="font-medium text-lg">Heart Rate</span>
                    </div>
                    <div className="flex flex-row gap-2">
                        <span className="text-5xl">{health_data.pulse_rate.toFixed(0)}</span>
                        <span className="self-end text-sm">bpm</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="space-y-2">
                    <div className="flex flex-row justify-start items-center gap-2">
                        <span className="bg-primary p-1 rounded-full aspect-square text-primary-foreground">
                            <IconLeaf className="stroke-[2.5] size-4" />
                        </span>
                        <span className="font-medium text-lg">Blood Oxygen</span>
                    </div>
                    <div className="flex flex-row gap-1">
                        <span className="text-5xl">{health_data.blood_oxygen.toFixed(2)}</span>
                        <span className="self-end text-sm">%</span>
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}