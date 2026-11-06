import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const body = await req.json()
        const { latitude, longitude, vehicleType } = body

        if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) {
            return NextResponse.json(
                { message: "coordinates not found" },
                { status: 400 }
            )
        }

        const lat = Number(latitude)
        const lon = Number(longitude)

        if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            return NextResponse.json(
                { message: "invalid coordinates" },
                { status: 400 }
            )
        }

        const partners = await User.find({
            role: "partner",
            isOnline: true,
            partnerStatus: "approved",
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lon, lat]
                    },
                    $maxDistance: 10000
                }
            }
        })

        const partnerIds = partners.map(p => p._id)

        if (partnerIds.length === 0) {
            return NextResponse.json(
                [],
                { status: 200 }
            )
        }

        const vehicleFilter: any = {
            owner: { $in: partnerIds },
            status: "approved",
            isActive: true
        }

        if (vehicleType) {
            vehicleFilter.type = vehicleType
        }

        const vehicles = await Vehicle.find(vehicleFilter).lean()

        return NextResponse.json(
            vehicles,
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { message: `near by vehicles error ${error}` },
            { status: 500 }
        )
    }
}
