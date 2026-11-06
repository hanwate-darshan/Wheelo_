import { auth } from "@/auth";
import connectDb from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
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

        const { bookingId } = await req.json()
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

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        booking.dropOtp = otp
        booking.dropOtpExpires = new Date(Date.now() + 5 * 60 * 1000)
        await booking.save()

        if (booking.user.email) {
            await sendMail(booking.user.email, "Your Drop OTP - WHEELO",
                `
        <div style="font-family:sans-serif;padding:20px">
          <h2>Ride OTP</h2>

          <p>Your drop OTP is:</p>

          <h1 style="letter-spacing:6px">${otp}</h1>

          <p>This OTP is valid for 5 minutes.</p>

          <p>Share this OTP with your driver to complete the ride.</p>

          <br/>

          <b>WHEELO</b>
        </div>
        `)
        }

        return NextResponse.json(
            { message: "drop otp sent" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "drop otp error" },
            { status: 500 }
        )
    }
}
