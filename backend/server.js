import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { EsewaInitiatePayment, paymentStatus } from "./controllers/esewa.controller.js"
import authRoutes from "./routes/authRoutes.js"
import bikeRoutes from "./routes/bikeRoutes.js"
import carRoutes from "./routes/carRoutes.js"
import vehicleRoutes from "./routes/vehicleRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"
import errorHandler from "./middleware/errorHandler.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(bodyParser.json())

mongoose.set("strictQuery", false)

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ridehub", {
    // Remove deprecated options
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    autoIndex: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

app.use("/api/auth", authRoutes)
app.use("/api/bikes", bikeRoutes)
app.use("/api/cars", carRoutes)
app.use("/api/vehicles", vehicleRoutes)
app.use("/api/users", userRoutes)
app.use("/api/bookings", bookingRoutes)
app.post("/initiate-payment", EsewaInitiatePayment)
app.post("/payment-status", paymentStatus)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...")
  console.log(err.name, err.message)
  process.exit(1)
})

