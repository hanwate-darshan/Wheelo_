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

        const bookingId = (await context.params).id
        const booking = await Booking.findById(bookingId)

        if (!booking) {
            return NextResponse.json(
                { success: false, message: "booking not found" },
                { status: 404 }
            )
        }

        // Verify the booking belongs to the authenticated user
        const user = await User.findOne({ email: session.user.email })
        if (!user || booking.user.toString() !== user._id.toString()) {
            return NextResponse.json(
                { success: false, message: "unauthorized" },
                { status: 403 }
            )
        }

        booking.paymentStatus = "cash"
        booking.bookingStatus = "confirmed"
        await booking.save()

        return NextResponse.json(
            { success: true },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { success: false, message: `cash confirm error ${error}` },
            { status: 500 }
        )
    }
}
