"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An area chart with gradient fill"

const chartData = [
    { time: "00:00", pulse: 186, blood_oxygen: 80 },
    { time: "01:00", pulse: 305, blood_oxygen: 200 },
    { time: "02:00", pulse: 237, blood_oxygen: 120 },
    { time: "03:00", pulse: 73, blood_oxygen: 190 },
    { time: "04:00", pulse: 209, blood_oxygen: 130 },
    { time: "05:00", pulse: 214, blood_oxygen: 140 },
    { time: "06:00", pulse: 186, blood_oxygen: 80 },
    { time: "07:00", pulse: 305, blood_oxygen: 200 },
    { time: "08:00", pulse: 237, blood_oxygen: 120 },
    { time: "09:00", pulse: 73, blood_oxygen: 190 },
    { time: "10:00", pulse: 209, blood_oxygen: 130 },
    { time: "11:00", pulse: 214, blood_oxygen: 140 },
    { time: "12:00", pulse: 214, blood_oxygen: 140 },
    { time: "13:00", pulse: 186, blood_oxygen: 80 },
    { time: "12:00", pulse: 305, blood_oxygen: 200 },
    { time: "13:00", pulse: 237, blood_oxygen: 120 },
    { time: "14:00", pulse: 73, blood_oxygen: 190 },
    { time: "15:00", pulse: 209, blood_oxygen: 130 },
    { time: "16:00", pulse: 214, blood_oxygen: 140 },
    { time: "17:00", pulse: 186, blood_oxygen: 80 },
    { time: "18:00", pulse: 305, blood_oxygen: 200 },
    { time: "19:00", pulse: 237, blood_oxygen: 120 },
    { time: "20:00", pulse: 73, blood_oxygen: 190 },
    { time: "21:00", pulse: 209, blood_oxygen: 130 },
    { time: "22:00", pulse: 214, blood_oxygen: 140 },
    { time: "23:00", pulse: 214, blood_oxygen: 140 },
]

const chartConfig = {
    pulse: {
        label: "Pulse",
        color: "var(--destructive)",
    },
    blood_oxygen: {
        label: "Oxygen",
        color: "var(--success)",
    },
} satisfies ChartConfig

export function HealthStatusGraph() {
    return (
        <ChartContainer config={chartConfig}>
            <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 2)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                    <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="var(--color-pulse)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-pulse)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                    <linearGradient id="fillblood_oxygen" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="var(--color-blood_oxygen)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-blood_oxygen)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="blood_oxygen"
                    type="natural"
                    fill="url(#fillblood_oxygen)"
                    fillOpacity={0.4}
                    stroke="var(--color-blood_oxygen)"
                    stackId="a"
                />
                <Area
                    dataKey="pulse"
                    type="natural"
                    fill="url(#fillDesktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-pulse)"
                    stackId="a"
                />
            </AreaChart>
        </ChartContainer>
    )
}
