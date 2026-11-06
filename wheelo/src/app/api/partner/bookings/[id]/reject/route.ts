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
        const id = (await context.params).id
        await connectDb()

        const session = await auth()
        if (!session || !session.user?.email) {
            return NextResponse.json(
                { message: "unauthorized" },
                { status: 401 }
            )
        }

        const partner = await User.findOne({ email: session.user.email })
        if (!partner) {
            return NextResponse.json(
                { message: "partner not found" },
                { status: 404 }
            )
        }

        const booking = await Booking.findById(id)

        if (!booking || booking.bookingStatus !== "requested") {
            return NextResponse.json(
                { message: "invalid" },
                { status: 400 }
            )
        }

        // Verify the partner owns this booking
        if (booking.driver.toString() !== partner._id.toString()) {
            return NextResponse.json(
                { message: "unauthorized" },
                { status: 403 }
            )
        }

        booking.bookingStatus = "rejected"
        await booking.save()

        await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/emit`, {
            event: "reject-booking",
            userId: booking.user,
            data: booking.bookingStatus
        })

        return NextResponse.json(
            { success: true },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: `reject booking error ${error}` },
            { status: 500 }
        )
    }
}
