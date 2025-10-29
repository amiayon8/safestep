"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalInit() {
    useEffect(() => {
        const initOneSignal = async () => {
            await OneSignal.init({
                appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
                safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_ID,
                allowLocalhostAsSecureOrigin: true,
                notifyButton: {
                    enable: true,
                    prenotify: true,
                    showCredit: false,
                    position: "bottom-right",
                    text: {
                        'dialog.blocked.title': "Notifications Blocked",
                        'dialog.blocked.message': "You've blocked notifications. To stay updated, please enable them in your browser settings.",
                        'dialog.main.title': "Stay Updated!",
                        'dialog.main.button.subscribe': "Allow Notifications",
                        'dialog.main.button.unsubscribe': "Disable Notifications",
                        'message.action.subscribed': "You’ll now receive updates from us",
                        'message.action.resubscribed': "Welcome back! Notifications re-enabled",
                        'message.action.unsubscribed': "You’ve unsubscribed from notifications",
                        'message.action.subscribing': "Subscribing… please wait",
                        'message.prenotify': "Click to get the latest news & updates!",
                        'tip.state.unsubscribed': "Click to subscribe to notifications",
                        'tip.state.subscribed': "You’re subscribed to notifications!",
                        'tip.state.blocked': "Notifications are blocked. Enable them in settings.",
                    },
                },
            });
        };

        initOneSignal();
    }, []);

    return null;
}
