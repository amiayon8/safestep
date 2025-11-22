import * as React from "react"
import { Card, CardContent } from "./ui/card";
import { IconHeartbeat, IconLeaf, IconRun } from "@tabler/icons-react";
import { cn } from "@/lib/utils"

export default function DashStats({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div className={cn("gap-3 grid grid-cols-3 font-nimbus", className)} {...props}>
            <Card>
                <CardContent className="space-y-2">
                    <div className="flex flex-row justify-start items-center gap-2">
                        <span className="bg-primary p-1 rounded-full aspect-square text-primary-foreground">
                            <IconHeartbeat className="stroke-[2.5] size-4" />
                        </span>
                        <span className="font-medium text-lg">Heart Rate</span>
                    </div>
                    <div className="flex flex-row gap-2">
                        <span className="text-5xl">72</span>
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
                        <span className="text-5xl">72</span>
                        <span className="self-end text-sm">%</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="space-y-2">
                    <div className="flex flex-row justify-start items-center gap-2">
                        <span className="bg-primary p-1 rounded-full aspect-square text-primary-foreground">
                            <IconRun className="stroke-[2.5] size-4" />
                        </span>
                        <span className="font-medium text-lg">Distance Covered</span>
                    </div>
                    <div className="flex flex-row gap-1">
                        <span className="text-5xl">6.9</span>
                        <span className="self-end text-sm">km</span>
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}