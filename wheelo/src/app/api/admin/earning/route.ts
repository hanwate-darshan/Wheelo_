import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb()

        const session = await auth()
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return NextResponse.json(
                { message: "unauthorized" },
                { status: 401 }
            )
        }

        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const bookings = await Booking.find({
            paymentStatus: "paid",
            createdAt: { $gte: sevenDaysAgo }
        }).select("adminCommission createdAt")

        let earningMap: Record<string, number> = {}

        bookings.forEach(b => {
            const date = new Date(b.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short"
            })

            if (!earningMap[date]) {
                earningMap[date] = 0
            }

            earningMap[date] = (earningMap[date] || 0) + (b.adminCommission || 0)
        });

        const earnings = Object.entries(earningMap).map(([date, earnings]) => ({
            date, earnings
        }))

        return NextResponse.json(
            earnings,
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { message: "admin earning error" },
            { status: 500 }
        )
    }
}
