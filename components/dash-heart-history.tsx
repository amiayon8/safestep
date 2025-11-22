import * as React from "react"
import { Card, CardContent } from "./ui/card";
import { IconHeartRateMonitor, IconBaselineDensityMedium, IconTrendingUp2, IconTrendingDown2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils"

export default function DashStats({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div className={cn("font-nimbus", className)} {...props}>
            <Card>
                <CardContent className="space-y-2">
                    <div className="flex flex-row justify-start items-center gap-2">
                        <span className="bg-primary p-1 rounded-full aspect-square text-primary-foreground">
                            <IconHeartRateMonitor className="stroke-[2.5] size-4" />
                        </span>
                        <span className="font-medium text-lg">Health Status</span>
                    </div>

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
                </CardContent>
            </Card>
        </div>
    )
}