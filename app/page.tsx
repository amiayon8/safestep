import DashLiveLocation from "@/components/dash-live-location";

export default function Page() {
  return (
    <section className="px-6 pt-6 pb-12 min-h-dvh">
      <div className="gap-3 grid sm:grid-cols-4">
        <div className="space-y-3 col-span-4">
          <DashLiveLocation />
        </div>
      </div>
    </section>
  );
}
