import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Footer({ className = "" }: React.ComponentProps<"div">) {
    return (
        <div className={cn("block bg-card shadow-sm mx-4 lg:mx-6 mt-auto py-3 border rounded-xl rounded-b-none w-auto text-muted-foreground text-xs md:text-sm text-center tracking-wide", className)}>
            © {new Date().getFullYear()} <span className="font-medium text-primary">AttendX</span>.{" "}
            Developed by{" "}
            <Link
                href="https://thenicedev.xyz"
                className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
            >
                The Nice Developer
            </Link>
        </div>
    );
}
