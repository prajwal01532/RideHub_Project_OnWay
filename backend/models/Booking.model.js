import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ["car", "bike"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    requiresDriver: {
      type: Boolean,
      default: false,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    message: String,
  },
  { timestamps: true },
)

export default mongoose.model("Booking", bookingSchema)

