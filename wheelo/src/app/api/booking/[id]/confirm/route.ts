import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import axios from "axios";
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

        // Notify driver via socket that ride is confirmed via cash
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/emit`, {
                event: "ride-confirmed",
                userId: booking.driver,
                data: {
                    bookingId: booking._id,
                    bookingStatus: "confirmed",
                    paymentStatus: "cash"
                }
            })
        } catch (socketErr) {
            console.log("Socket emit error on cash confirm:", socketErr)
        }

        return NextResponse.json(
            { success: true, booking },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { success: false, message: `cash confirm error ${error}` },
            { status: 500 }
        )
    }
}
