import express from "express"
import * as bookingController from "../controllers/bookingController.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Protected routes
router.get("/", verifyToken, bookingController.getBookings)
router.post("/", verifyToken, bookingController.createBooking)
router.patch("/:id/cancel", verifyToken, bookingController.cancelBooking)

// Payment webhook endpoints (no auth required as they are called by eSewa)
router.post("/payment-status", bookingController.updateBookingStatus)
router.post("/payment-failure", bookingController.handlePaymentFailure)

export default router
