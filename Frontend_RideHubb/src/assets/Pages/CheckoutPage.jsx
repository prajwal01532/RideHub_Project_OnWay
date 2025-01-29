import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { generateUniqueId } from "esewajs";
import axios from 'axios';
import { FaCalendarAlt, FaUser, FaCar, FaMotorcycle, FaClock, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays, format, isAfter, isBefore, startOfDay } from 'date-fns';

const DRIVER_PRICE_PER_DAY = 500;
const MIN_BOOKING_DAYS = 1;
const MAX_BOOKING_DAYS = 30;

const CheckoutPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: null,
    endDate: null,
    requiresDriver: false,
    pickupLocation: '',
    dropoffLocation: '',
    message: ''
  });

  useEffect(() => {
    // Redirect if user is not logged in
    if (!user) {
      toast.error('Please login to make a booking');
      navigate('/login', { state: { from: `/vehicles/${type}/${id}` } });
      return;
    }

    const fetchVehicleDetails = async () => {
      try {
        const response = await api.get(`/vehicles/${type}/${id}`);
        if (response.data.success) {
          setVehicle(response.data.data);
        } else {
          throw new Error('Failed to fetch vehicle details');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load vehicle details');
        navigate('/vehicles/' + type);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [type, id, navigate, user]);

  const calculateTotalAmount = () => {
    if (!vehicle || !bookingDetails.startDate || !bookingDetails.endDate) return 0;
    
    const days = Math.ceil(
      (bookingDetails.endDate.getTime() - bookingDetails.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    let totalAmount = days * vehicle.pricePerDay;
    if (bookingDetails.requiresDriver) {
      totalAmount += days * DRIVER_PRICE_PER_DAY;
    }
    
    return totalAmount;
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value.trim()
    }));
  };

  const handleDateChange = (date, field) => {
    const today = startOfDay(new Date());
    
    // Validate date is not in the past
    if (isBefore(date, today)) {
      toast.error('Cannot select a date in the past');
      return;
    }

    setBookingDetails(prev => {
      const newDetails = { ...prev, [field]: date };

      // If setting start date
      if (field === 'startDate') {
        // Reset end date if it's before new start date or exceeds max duration
        if (prev.endDate && (isBefore(prev.endDate, date) || 
            Math.ceil((prev.endDate - date) / (1000 * 60 * 60 * 24)) > MAX_BOOKING_DAYS)) {
          newDetails.endDate = addDays(date, 1);
        }
      }

      // If setting end date
      if (field === 'endDate') {
        const duration = Math.ceil((date - prev.startDate) / (1000 * 60 * 60 * 24));
        if (duration > MAX_BOOKING_DAYS) {
          toast.error(`Maximum booking duration is ${MAX_BOOKING_DAYS} days`);
          return prev;
        }
      }

      return newDetails;
    });
  };

  const validateBooking = () => {
    if (!bookingDetails.startDate || !bookingDetails.endDate) {
      toast.error('Please select both start and end dates');
      return false;
    }

    if (!bookingDetails.pickupLocation.trim()) {
      toast.error('Please enter pickup location');
      return false;
    }

    if (!bookingDetails.dropoffLocation.trim()) {
      toast.error('Please enter drop-off location');
      return false;
    }

    const duration = Math.ceil(
      (bookingDetails.endDate - bookingDetails.startDate) / (1000 * 60 * 60 * 24)
    );

    if (duration < MIN_BOOKING_DAYS) {
      toast.error(`Minimum booking duration is ${MIN_BOOKING_DAYS} day`);
      return false;
    }

    if (duration > MAX_BOOKING_DAYS) {
      toast.error(`Maximum booking duration is ${MAX_BOOKING_DAYS} days`);
      return false;
    }

    const totalAmount = calculateTotalAmount();
    if (totalAmount <= 0) {
      toast.error('Invalid booking amount');
      return false;
    }

    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
 
    if (!user) {

      toast.error('Please login to make a booking');
      navigate('/login', { state: { from: `/vehicles/${type}/${id}` } });
      return;
    }

    if (!validateBooking()) {
      return;
    }

    try {
      setIsProcessing(true);
      const totalAmount = calculateTotalAmount();
      const productId = generateUniqueId();
      
      // Prepare booking details
      const bookingData = {
        userId: user.id, // Use user.id instead of user._id
        vehicleId: id,
        vehicleType: type,
        startDate: bookingDetails.startDate.toISOString(),
        endDate: bookingDetails.endDate.toISOString(),
        totalAmount,
        requiresDriver: bookingDetails.requiresDriver,
        pickupLocation: bookingDetails.pickupLocation.trim(),
        dropoffLocation: bookingDetails.dropoffLocation.trim(),
        message: bookingDetails.message.trim()
      };

      console.log('Initiating payment with details:', {
        amount: totalAmount,
        productId,
        bookingDetails: bookingData
      });

      const response = await axios.post(
        "http://localhost:5000/initiate-payment",
        {
          amount: totalAmount,
          productId,
          bookingDetails: bookingData
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success && response.data.url) {
        console.log('Payment initiated successfully');
        window.location.href = response.data.url;
      } else {
        throw new Error(response.data.message || 'Payment URL not received');
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      let errorMessage = 'Payment initiation failed';
      
      if (error.response?.data?.message) {
        // Server provided an error message
        errorMessage = error.response.data.message;
      } else if (error.response) {
        // Server responded with an error but no message
        errorMessage = `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Error in request setup
        errorMessage = error.message;
      }
      
      if (errorMessage.includes('token') || error.response?.status === 401) {
        toast.error('Please login again to continue');
        navigate('/login', { state: { from: `/vehicles/${type}/${id}` } });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const numberOfDays = bookingDetails.startDate && bookingDetails.endDate
    ? Math.ceil((bookingDetails.endDate - bookingDetails.startDate) / (1000 * 60 * 60 * 24))
    : 0;

  const CustomDatePickerInput = React.forwardRef(({ value, onClick, label, icon }, ref) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div 
        className="relative w-full cursor-pointer"
        onClick={onClick}
      >
        <input
          ref={ref}
          value={value}
          readOnly
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 cursor-pointer bg-white"
          placeholder="Select date"
        />
        {icon && <div className="absolute right-3 top-3 text-gray-400">{icon}</div>}
      </div>
    </div>
  ));

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Vehicle Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  {type === 'car' ? <FaCar className="mr-2" /> : <FaMotorcycle className="mr-2" />}
                  Vehicle Details
                </h2>
                
                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                  <img
                    src={vehicle?.images?.[0] || "/placeholder.svg"}
                    alt={vehicle?.name}
                    className="w-full md:w-64 h-48 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{vehicle?.name}</h3>
                    <p className="text-gray-600 mb-2">{vehicle?.brand}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-600">
                        <FaMoneyBillWave className="mr-2" />
                        <span>Rs. {vehicle?.pricePerDay}/day</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaClock className="mr-2" />
                        <span>Available Now</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handlePayment} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <DatePicker
                    selected={bookingDetails.startDate}
                    onChange={(date) => handleDateChange(date, 'startDate')}
                    minDate={new Date()}
                    customInput={
                      <CustomDatePickerInput
                        label="Start Date *"
                        icon={<FaCalendarAlt />}
                      />
                    }
                  />
                  
                  <DatePicker
                    selected={bookingDetails.endDate}
                    onChange={(date) => handleDateChange(date, 'endDate')}
                    minDate={bookingDetails.startDate ? addDays(bookingDetails.startDate, 1) : new Date()}
                    customInput={
                      <CustomDatePickerInput
                        label="End Date *"
                        icon={<FaCalendarAlt />}
                      />
                    }
                    disabled={!bookingDetails.startDate}
                  />
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Location *
                    </label>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={bookingDetails.pickupLocation}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter pickup location"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Drop-off Location *
                    </label>
                    <input
                      type="text"
                      name="dropoffLocation"
                      value={bookingDetails.dropoffLocation}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter drop-off location"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="requiresDriver"
                      checked={bookingDetails.requiresDriver}
                      onChange={handleInputChange}
                      className="form-checkbox h-5 w-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-gray-700">Need a Driver? (Rs. {DRIVER_PRICE_PER_DAY}/day)</span>
                  </label>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={bookingDetails.message}
                    onChange={handleInputChange}
                    rows="3"
                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Any special requests or notes?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition duration-200 ${
                    isProcessing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Pay with eSewa'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Duration:</span>
                    <span>{numberOfDays} days</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Vehicle Rate:</span>
                    <span>Rs. {vehicle?.pricePerDay}/day</span>
                  </div>
                  
                  {bookingDetails.requiresDriver && (
                    <div className="flex justify-between text-gray-600">
                      <span>Driver Rate:</span>
                      <span>Rs. {DRIVER_PRICE_PER_DAY}/day</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Vehicle Total:</span>
                    <span>Rs. {vehicle?.pricePerDay * numberOfDays}</span>
                  </div>

                  {bookingDetails.requiresDriver && (
                    <div className="flex justify-between text-gray-600">
                      <span>Driver Total:</span>
                      <span>Rs. {DRIVER_PRICE_PER_DAY * numberOfDays}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount:</span>
                      <span>Rs. {calculateTotalAmount()}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      * All fields marked with an asterisk are required
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
