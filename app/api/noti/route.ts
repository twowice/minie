import { NextResponse } from "next/server";

let notifications = [
  { id: 1, message: "알람 1", read: false },
  { id: 2, message: "알람 2", read: false },
];

export async function GET() {
    return NextResponse.json(notifications);
}

export async function POST(req: Request) {
    const { message } = await req.json();
    const newNotification = {
        id: notifications.length + 1,
        message,
        read: false,
    };
    notifications.unshift(newNotification);
    return NextResponse.json(newNotification);
}