import KmlImporter from "@/components/kml-importer";

export const metadata = {
  title: "KML Route Import | SafeStep",
  description: "Import KML route files step by step with Google Maps links and 1s delay per step",
};

export default function KmlPage() {
  return (
    <main className="min-h-dvh">
      <KmlImporter />
    </main>
  );
}
