"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingItems } from "@/components/loading-items";

type SosData = {
    id: number;
    created_at: string;
};

type SosWithLocation = SosData & {
    latitude?: number;
    longitude?: number;
};

export default function SosTable() {
    const supabase = createClient();
    const [data, setData] = useState<SosWithLocation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // Fetch all SOS rows
            const { data: sosData, error: sosError } = await supabase
                .from("sos")
                .select("id, created_at")
                .order("created_at", { ascending: false });

            if (sosError || !sosData) {
                setLoading(false);
                return;
            }

            // For each SOS, fetch the nearest GPS row within ±5 minutes
            const enrichedData: SosWithLocation[] = await Promise.all(
                sosData.map(async (sos) => {
                    const createdAt = new Date(sos.created_at);

                    const minTime = new Date(createdAt.getTime() - 5 * 60 * 1000).toISOString();
                    const maxTime = new Date(createdAt.getTime() + 5 * 60 * 1000).toISOString();

                    const { data: gpsRows, error: gpsError } = await supabase
                        .from("gps_data")
                        .select("latitude, longitude, created_at")
                        .gte("created_at", minTime)
                        .lte("created_at", maxTime)
                        .order("created_at", { ascending: true })
                        .limit(1);

                    if (gpsError || !gpsRows || gpsRows.length === 0) return sos;

                    return {
                        ...sos,
                        latitude: gpsRows[0].latitude,
                        longitude: gpsRows[0].longitude,
                    };
                })
            );

            setData(enrichedData);
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div className="mx-4 lg:mx-6 my-4 md:my-6">
            <Card>
                <CardHeader>
                    <CardTitle>SOS History</CardTitle>
                    <CardDescription>List of all SOS alerts triggered with nearest location.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    {loading ? (
                        <LoadingItems />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Latitude</TableHead>
                                    <TableHead>Longitude</TableHead>
                                    <TableHead>Google Maps</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                                        <TableCell>{row.latitude ?? "-"}</TableCell>
                                        <TableCell>{row.longitude ?? "-"}</TableCell>
                                        <TableCell>
                                            {row.latitude && row.longitude ? (
                                                <a
                                                    href={`https://www.google.com/maps?q=${row.latitude},${row.longitude}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="underline"
                                                >
                                                    View
                                                </a>
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
