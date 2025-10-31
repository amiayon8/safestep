import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/admin";

export async function POST(req: Request) {
    const supabase = await createClient();
    try {
        const { key } = await req.json();

        if (!(key === process.env.SOS_AUTH_SECRET_KEY)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { error } = await supabase.from("sos").insert([{ created_at: new Date().toISOString() }]);

        const response = await fetch("https://onesignal.com/api/v1/notifications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
            },
            body: JSON.stringify({
                app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
                headings: { en: "SOS Alert!!" },
                contents: { en: "SafeStep User is in Danger!!!" },
                url: "https://thenicedev.xyz", // optional link
                included_segments: ["All"], // send to all users
            }),
        });

        const data = await response.json();
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Notification error:", error);
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }
}