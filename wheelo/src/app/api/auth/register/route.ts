import connectDb from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password } = body || {};

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "All fields (name, email, password) are required" },
                { status: 400 }
            );
        }

        const cleanEmail = String(email).trim().toLowerCase();
        const cleanName = String(name).trim();

        if (password.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        await connectDb();
        let user = await User.findOne({ email: cleanEmail });

        if (user && user.isEmailVerified) {
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 400 }
            );
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        const hashedPassword = await bcrypt.hash(password, 10);

        if (user && !user.isEmailVerified) {
            user.name = cleanName;
            user.password = hashedPassword;
            user.email = cleanEmail;
            user.otp = otp;
            user.otpExpiresAt = otpExpiresAt;
            await user.save();
        } else {
            user = await User.create({
                name: cleanName,
                email: cleanEmail,
                password: hashedPassword,
                otp,
                otpExpiresAt,
            });
        }

        try {
            await sendMail(
                cleanEmail,
                "Your OTP for Email Verification - WHEELO",
                `<h2>Your Email Verification OTP is <strong>${otp}</strong></h2><p>This OTP will expire in 10 minutes.</p>`
            );
        } catch (mailError) {
            console.error("Email send failed in register route:", mailError);
        }

        // Return a secure response without exposing password or plain-text OTP
        return NextResponse.json(
            {
                success: true,
                message: "OTP sent successfully to your email",
                email: cleanEmail,
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: `Register error: ${error}` },
            { status: 500 }
        );
    }
}
