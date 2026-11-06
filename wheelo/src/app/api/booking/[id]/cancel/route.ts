import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDb()
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "unauthorized" },
                { status: 401 }
            )
        }

        const id = (await context.params).id
        const booking = await Booking.findById(id)

        if (!booking) {
            return NextResponse.json(
                { message: "booking not found" },
                { status: 404 }
            )
        }

        // Allow cancellation for both 'requested' and 'awaiting_payment' statuses
        if (booking.bookingStatus !== "requested" && booking.bookingStatus !== "awaiting_payment") {
            return NextResponse.json(
                { message: "booking cannot be cancelled in current status" },
                { status: 400 }
            )
        }

        // Verify the user owns this booking
        const user = await User.findOne({ email: session.user.email })
        if (!user || booking.user.toString() !== user._id.toString()) {
            return NextResponse.json(
                { message: "unauthorized" },
                { status: 403 }
            )
        }

        booking.bookingStatus = "cancelled"
        await booking.save()

        return NextResponse.json(
            { success: true },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `cancel booking error ${error}` },
            { status: 500 }
        )
    }
}
