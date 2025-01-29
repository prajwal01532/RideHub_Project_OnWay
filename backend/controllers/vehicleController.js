import Car from '../models/Car.js';
import Bike from '../models/Bike.js';

// Add a new vehicle
export const addVehicle = async (req, res) => {
  try {
    const vehicleData = req.body;
    let vehicle;
    
    // Create new vehicle based on type
    if (vehicleData.type === 'car') {
      vehicle = new Car(vehicleData);
    } else if (vehicleData.type === 'bike') {
      vehicle = new Bike(vehicleData);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle type'
      });
    }
    
    await vehicle.save();

    res.status(201).json({
      success: true,
      message: `${vehicleData.type === 'car' ? 'Car' : 'Bike'} added successfully`,
      data: vehicle
    });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add vehicle'
    });
  }
};

// Get vehicles by type (car/bike)
export const getVehiclesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['car', 'bike'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle type'
      });
    }

    const Model = type === 'car' ? Car : Bike;
    const vehicles = await Model.find().sort('-createdAt');

    res.status(200).json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch vehicles'
    });
  }
};

// Get vehicle by ID
export const getVehicleById = async (req, res) => {
  try {
    const { id, type } = req.params;
    const Model = type === 'car' ? Car : Bike;
    
    const vehicle = await Model.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch vehicle'
    });
  }
};

// Update vehicle
export const updateVehicle = async (req, res) => {
  try {
    const { type, id } = req.params;
    const updateData = req.body;

    // Validate vehicle type
    if (!['car', 'bike'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle type'
      });
    }

    const Model = type === 'car' ? Car : Bike;

    // Find and update the vehicle
    const vehicle = await Model.findById(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Update only the fields that are provided
    Object.keys(updateData).forEach(key => {
      if (key !== '_id' && key !== '__v' && key !== 'type') {
        if (key === 'location' && typeof updateData[key] === 'object') {
          vehicle.location = {
            ...vehicle.location,
            ...updateData[key]
          };
        } else {
          vehicle[key] = updateData[key];
        }
      }
    });

    // Save the updated vehicle
    await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update vehicle'
    });
  }
};

// Update vehicle status
export const updateVehicleStatus = async (req, res) => {
  try {
    const { id, type } = req.params;
    const { status } = req.body;
    
    if (!['available', 'rented', 'maintenance'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const Model = type === 'car' ? Car : Bike;
    const vehicle = await Model.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle status updated successfully',
      data: vehicle
    });
  } catch (error) {
    console.error('Error updating vehicle status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update vehicle status'
    });
  }
};

// Delete vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const { id, type } = req.params;
    const Model = type === 'car' ? Car : Bike;
    
    const vehicle = await Model.findByIdAndDelete(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `${type === 'car' ? 'Car' : 'Bike'} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete vehicle'
    });
  }
};