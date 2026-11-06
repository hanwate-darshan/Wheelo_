import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDb();
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "User is not authenticated" },
                { status: 401 }
            );
        }

        const user = await User.findOne({ email: session.user.email.toLowerCase() })
            .select("-password -otp -otpExpiresAt")
            .lean();

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `Get me error: ${error}` },
            { status: 500 }
        );
    }
}
