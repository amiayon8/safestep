import * as React from "react"
import { Card, CardContent } from "@/components/ui/card";
import { IconHeartRateMonitor, IconBaselineDensityMedium, IconTrendingUp2, IconTrendingDown2, IconArrowsDiagonal } from "@tabler/icons-react";
import { cn } from "@/lib/utils"
import { HealthStatusGraph } from "./health-status-graph";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
    let condition = 1;

    return (
        <div className="px-6 pt-6 pb-12 min-h-dvh font-nimbus">
            <Card>
                <CardContent className="space-y-2">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row justify-start items-center gap-2">
                            <span className="bg-primary p-1 rounded-full aspect-square text-primary-foreground">
                                <IconHeartRateMonitor className="stroke-[2.5] size-4" />
                            </span>
                            <span className="font-medium text-lg">Health Status</span>
                        </div>

                        <Button variant="ghost" asChild>
                            <Link href="/health-status">
                                <IconArrowsDiagonal />
                            </Link>
                        </Button>
                    </div>

                    {condition === 0 && (
                        <div className="flex justify-center items-center my-4 w-full h-full">
                            <div className="flex justify-center items-center bg-blue-300/20 rounded-full size-48 text-center">
                                <div className="flex justify-center items-center bg-blue-300/50 dark:bg-blue-300/30 rounded-full size-40 text-center">
                                    <div className="flex justify-center items-center bg-blue-400 rounded-full size-32 text-center">
                                        <span className="font-semibold text-white text-xl">NORMAL</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {condition === 1 && (
                        <div className="flex justify-center items-center my-4 w-full h-full">
                            <div className="flex justify-center items-center bg-green-300/20 rounded-full size-48 text-center">
                                <div className="flex justify-center items-center bg-green-300/50 dark:bg-green-300/30 rounded-full size-40 text-center">
                                    <div className="flex justify-center items-center bg-green-400 rounded-full size-32 text-center">
                                        <span className="font-semibold text-white text-2xl">GOOD</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {condition === 2 && (
                        <div className="flex justify-center items-center my-4 w-full h-full">
                            <div className="flex justify-center items-center bg-red-300/20 rounded-full size-48 text-center">
                                <div className="flex justify-center items-center bg-red-300/50 dark:bg-red-300/30 rounded-full size-40 text-center">
                                    <div className="flex justify-center items-center bg-red-500 rounded-full size-32 text-center">
                                        <span className="font-semibold text-white text-2xl">POOR</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-row justify-between items-start mt-5">
                        <div className="flex-row justify-start items-start">
                            <div className="flex flex-row justify-start items-center gap-1">
                                <span className="bg-primary p-1 rounded-full aspect-square text-primary-foreground">
                                    <IconBaselineDensityMedium className="stroke-3 size-2" />
                                </span>
                                <span className="text-sm tracking-tight">Average</span>
                            </div>

                            <div className="flex flex-row gap-1 mt-6">
                                <span className="text-3xl leading-0">120</span>
                                <span className="self-end text-muted-foreground text-xs">BPM</span>
                            </div>
                        </div>


                        <div className="flex-row justify-start items-start">
                            <div className="flex flex-row justify-start items-center gap-1">
                                <span className="bg-primary p-1 rounded-full aspect-square text-primary-foreground">
                                    <IconTrendingUp2 className="stroke-3 size-2" />
                                </span>
                                <span className="text-sm tracking-tight">Maximum</span>
                            </div>

                            <div className="flex flex-row gap-1 mt-6">
                                <span className="text-3xl leading-0">120</span>
                                <span className="self-end text-muted-foreground text-xs">BPM</span>
                            </div>
                        </div>


                        <div className="flex-row justify-start items-start">
                            <div className="flex flex-row justify-start items-center gap-1">
                                <span className="bg-primary p-1 rounded-full aspect-square text-primary-foreground">
                                    <IconTrendingDown2 className="stroke-3 size-2" />
                                </span>
                                <span className="text-sm tracking-tight">Minimum</span>
                            </div>

                            <div className="flex flex-row gap-1 mt-6">
                                <span className="text-3xl leading-0">120</span>
                                <span className="self-end text-muted-foreground text-xs">BPM</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <HealthStatusGraph></HealthStatusGraph>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}