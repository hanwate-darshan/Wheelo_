import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import Booking from "@/models/booking.model";
import axios from "axios";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { bookingId, razorpay_payment_id, razorpay_signature, razorpay_order_id } = await req.json()

        if (!bookingId || !razorpay_payment_id || !razorpay_signature || !razorpay_order_id) {
            return NextResponse.json(
                { success: false, message: "missing required payment details" },
                { status: 400 }
            )
        }

        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest("hex");

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json(
                { success: false, message: "invalid signature" },
                { status: 400 }
            )
        }

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return NextResponse.json(
                { success: false, message: "booking not found" },
                { status: 404 }
            )
        }

        const adminCommission = booking.fare * 0.10
        const partnerAmount = booking.fare - adminCommission
        booking.adminCommission = adminCommission
        booking.partnerAmount = partnerAmount
        booking.paymentStatus = "paid"
        booking.bookingStatus = "confirmed"
        await booking.save()

        // Notify driver via socket that ride is confirmed via online payment
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/emit`, {
                event: "ride-confirmed",
                userId: booking.driver,
                data: {
                    bookingId: booking._id,
                    bookingStatus: "confirmed",
                    paymentStatus: "paid"
                }
            })
        } catch (socketErr) {
            console.log("Socket emit error on online payment confirm:", socketErr)
        }

        return NextResponse.json(
            { success: true, adminCommission, partnerAmount },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { success: false, message: `verify payment error ${error}` },
            { status: 500 }
        )
    }
}
