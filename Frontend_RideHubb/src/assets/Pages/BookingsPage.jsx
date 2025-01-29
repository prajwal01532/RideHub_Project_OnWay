import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCar, FaMotorcycle, FaClock, FaMoneyBillWave, FaReceipt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaCalendarAlt className="mr-2 text-orange-600" />
              My Bookings
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="mb-4">No bookings found.</p>
              <a href="/vehicles" className="text-primary hover:text-primary-dark">
                Start exploring our vehicles to make your first booking!
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {booking.vehicleType === 'car' ? (
                            <FaCar className="text-blue-600 mr-2 text-xl" />
                          ) : (
                            <FaMotorcycle className="text-purple-600 mr-2 text-xl" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.vehicle?.name || 'Vehicle'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.vehicle?.brand || booking.vehicleType}
                            </div>
                            {booking.requiresDriver && (
                              <div className="text-xs text-green-600 mt-1">
                                With Driver
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <FaCalendarAlt className="mr-2 text-gray-400" />
                            Start: {formatDate(booking.startDate)}
                          </div>
                          <div className="flex items-center mb-1">
                            <FaCalendarAlt className="mr-2 text-gray-400" />
                            End: {formatDate(booking.endDate)}
                          </div>
                          <div className="flex items-center text-gray-500">
                            <FaClock className="mr-2" />
                            {booking.duration} days
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center mb-1">
                            <FaMoneyBillWave className="mr-2 text-green-500" />
                            <span className="font-medium">Rs. {booking.totalAmount}</span>
                          </div>
                          {booking.transactionId && (
                            <div className="flex items-center text-gray-500">
                              <FaReceipt className="mr-2" />
                              <span className="text-xs">ID: {booking.transactionId}</span>
                            </div>
                          )}
                          {booking.transaction && (
                            <div className={`text-xs mt-1 ${getStatusColor(booking.transaction.status)}`}>
                              Payment: {booking.transaction.status}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;