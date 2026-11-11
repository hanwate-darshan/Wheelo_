import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()

        const session = await auth()
        if (!session || !session.user?.email) {
            return NextResponse.json(
                { message: "unauthorized" },
                { status: 401 }
            )
        }

        const { bookingId, otp } = await req.json()
        const booking = await Booking.findById(bookingId).populate("user")
        if (!booking) {
            return NextResponse.json(
                { message: "booking not found" },
                { status: 400 }
            )
        }

        // Verify the partner owns this booking
        const partner = await User.findOne({ email: session.user.email })
        if (!partner || booking.driver.toString() !== partner._id.toString()) {
            return NextResponse.json(
                { message: "unauthorized" },
                { status: 403 }
            )
        }

        if (!booking.dropOtp) {
            return NextResponse.json(
                { message: "drop otp not generated" },
                { status: 400 }
            )
        }

        if (booking.dropOtpExpires < new Date()) {
            return NextResponse.json(
                { message: "otp expired" },
                { status: 400 }
            )
        }

        if (booking.dropOtp !== otp) {
            return NextResponse.json(
                { message: "incorrect drop otp" },
                { status: 400 }
            )
        }

        if (booking.paymentStatus === "cash") {
            const adminCommission = booking.fare * 0.10
            const partnerAmount = booking.fare - adminCommission
            booking.adminCommission = adminCommission
            booking.partnerAmount = partnerAmount
        }

        booking.paymentStatus = "paid"
        booking.bookingStatus = "completed"
        booking.dropOtp = ""
        booking.dropOtpExpires = undefined
        await booking.save()

        // Notify user via socket that ride is completed
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/emit`, {
                event: "ride-completed",
                userId: booking.user._id || booking.user,
                data: {
                    bookingId: booking._id,
                    bookingStatus: "completed"
                }
            })
        } catch (socketErr) {
            console.log("Socket emit error on drop verify:", socketErr)
        }

        return NextResponse.json(
            { message: "drop otp verified", success: true },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "drop otp verify error" },
            { status: 500 }
        )
    }
}
