import Booking from "../models/Booking.model.js"
import Car from "../models/Car.js"
import Bike from "../models/Bike.js"
import { Transaction } from "../models/Transaction.model.js"

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort("-createdAt")
      .populate("vehicle")
      .lean()

    // Enhance the bookings with transaction information
    const enhancedBookings = await Promise.all(
      bookings.map(async (booking) => {
        if (booking.transactionId) {
          const transaction = await Transaction.findOne({ product_id: booking.transactionId }).lean()
          return {
            ...booking,
            transaction: transaction
              ? {
                  id: transaction.product_id,
                  status: transaction.status,
                  amount: transaction.amount,
                }
              : null,
          }
        }
        return booking
      })
    )

    res.status(200).json({ success: true, data: enhancedBookings })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    res.status(500).json({ success: false, message: "Failed to fetch bookings" })
  }
}

export const createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, requiresDriver, message, transactionId } = req.body

    if (!vehicleId || !startDate || !endDate || !transactionId) {
      return res.status(400).json({
        success: false,
        message: "Vehicle ID, start date, end date, and transaction ID are required",
      })
    }

    const startDateTime = new Date(startDate)
    const endDateTime = new Date(endDate)
    const duration = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24))

    if (duration < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid duration. End date must be after start date",
      })
    }

    let vehicle
    let vehicleType
    try {
      vehicle = (await Car.findById(vehicleId)) || (await Bike.findById(vehicleId))
      vehicleType = vehicle instanceof Car ? "car" : "bike"
    } catch (error) {
      console.error("Error finding vehicle:", error)
    }

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" })
    }

    const driverCost = requiresDriver ? 500 * duration : 0
    const vehicleCost = vehicle.pricePerDay * duration
    const totalCost = vehicleCost + driverCost

    const booking = new Booking({
      user: req.user._id,
      vehicle: vehicleId,
      vehicleType,
      startDate: startDateTime,
      endDate: endDateTime,
      duration,
      totalAmount: totalCost,
      requiresDriver,
      message,
      transactionId,
      status: "pending",
    })

    await booking.save()

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create booking",
    })
  }
}

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" })
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this booking" })
    }

    const Model = booking.vehicleType === "car" ? Car : Bike
    const vehicle = await Model.findById(booking.vehicle)
    if (vehicle) {
      vehicle.status = "available"
      await vehicle.save()
    }

    booking.status = "cancelled"
    await booking.save()

    res.status(200).json({ success: true, message: "Booking cancelled successfully" })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel booking",
    })
  }
}

export const handlePaymentFailure = async (req, res) => {
  const { transactionId } = req.body;

  try {
    console.log("Payment failure for transaction:", transactionId);

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required"
      });
    }

    // Find and update both transaction and booking
    const [transaction, booking] = await Promise.all([
      Transaction.findOne({ product_id: transactionId }),
      Booking.findOne({ transactionId })
    ]);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Update transaction status
    transaction.status = "failed";
    booking.status = "cancelled";

    // If vehicle exists, update its status back to available
    if (booking.vehicle) {
      const Model = booking.vehicleType === "car" ? Car : Bike;
      const vehicle = await Model.findById(booking.vehicle);
      if (vehicle) {
        vehicle.status = "available";
        await vehicle.save();
      }
    }

    await Promise.all([transaction.save(), booking.save()]);

    return res.status(200).json({
      success: true,
      message: "Payment failure handled successfully",
      data: {
        transactionId,
        bookingId: booking._id
      }
    });
  } catch (error) {
    console.error("Error handling payment failure:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while handling payment failure",
      details: error.message
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  const { transactionId, status } = req.body;

  try {
    console.log("Updating booking status:", { transactionId, status });

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required"
      });
    }

    // Find both transaction and booking
    const [transaction, booking] = await Promise.all([
      Transaction.findOne({ product_id: transactionId }),
      Booking.findOne({ transactionId })
    ]);

    if (!transaction) {
      console.log(`No transaction found for ID: ${transactionId}`);
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    if (!booking) {
      console.log(`No booking found for transaction ID: ${transactionId}`);
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Update transaction status
    transaction.status = status === "completed" ? "completed" : "failed";
    
    // Update booking status and vehicle status
    if (status === "completed") {
      booking.status = "completed";
      
      // Update vehicle status if it exists
      if (booking.vehicle) {
        const Model = booking.vehicleType === "car" ? Car : Bike;
        const vehicle = await Model.findById(booking.vehicle);
        if (vehicle) {
          vehicle.status = "booked";
          await vehicle.save();
        }
      }
    } else {
      booking.status = "cancelled";
      
      // Update vehicle status if it exists
      if (booking.vehicle) {
        const Model = booking.vehicleType === "car" ? Car : Bike;
        const vehicle = await Model.findById(booking.vehicle);
        if (vehicle) {
          vehicle.status = "available";
          await vehicle.save();
        }
      }
    }

    await Promise.all([transaction.save(), booking.save()]);

    console.log("Updated booking and transaction:", {
      bookingStatus: booking.status,
      transactionStatus: transaction.status
    });

    return res.status(200).json({
      success: true,
      message: `Booking ${status === "completed" ? "confirmed" : "cancelled"} successfully`,
      data: {
        booking: {
          id: booking._id,
          status: booking.status,
          vehicle: booking.vehicle,
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalAmount: booking.totalAmount
        },
        transaction: {
          id: transaction.product_id,
          status: transaction.status,
          amount: transaction.amount
        }
      }
    });
  } catch (error) {
    console.error("Error in updateBookingStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating booking status",
      details: error.message
    });
  }
};
