import DashStats from "@/components/dash-stats"
import DashHeartHistory from "@/components/dash-heart-history"

export default function Page() {
    return (
        <main className="p-6 min-h-dvh">
            <div className="gap-3 grid grid-cols-6">
                <DashStats className="col-span-4" />
                <DashHeartHistory className="col-span-2" />
            </div>
        </main>
    )
}