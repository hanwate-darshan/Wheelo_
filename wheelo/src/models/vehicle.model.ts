import mongoose from "mongoose";

export type vehicleType =
    "bike" |
    "car" |
    "loading" |
    "truck" |
    "auto";

export interface IVehicle {
    owner: mongoose.Types.ObjectId;
    type: vehicleType;
    vehicleModel: string;
    number: string;
    imageUrl?: string;
    baseFare?: number;
    pricePerKM?: number;
    waitingCharge?: number;
    status: "approved" | "pending" | "rejected";
    rejectionReason?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const vehicleSchema = new mongoose.Schema<IVehicle>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: ["bike", "car", "loading", "truck", "auto"],
        required: true,
        index: true,
    },
    number: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    vehicleModel: {
        type: String,
        required: true,
    },
    imageUrl: String,
    baseFare: Number,
    pricePerKM: Number,
    waitingCharge: Number,
    status: {
        type: String,
        enum: ["approved", "rejected", "pending"],
        default: "pending",
        index: true,
    },
    rejectionReason: String,
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
}, { timestamps: true });

const Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
