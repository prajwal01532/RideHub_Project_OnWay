import React from 'react';
import { motion } from 'framer-motion';
import LayoutPrazzol from '../../LayoutPrazzol';
import { FaCar, FaMotorcycle, FaShieldAlt, FaTools, FaRoute, FaClock, FaUserTie, FaPhoneAlt } from 'react-icons/fa';
import { MdLocationOn, MdSecurity, MdLocalOffer } from 'react-icons/md';

const ServicesPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <LayoutPrazzol>
      {/* Hero Section with Parallax Effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[500px] overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
            filter: 'brightness(0.7)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-orange-400/80" />
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Our Premium Services
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-white opacity-90 max-w-3xl mx-auto px-4"
            >
              Experience the best in vehicle rental services with our comprehensive range of offerings
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Main Services Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Vehicle Rental Services */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mb-20"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold text-gray-900 mb-12 text-center"
            >
              Vehicle Rental Services
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Car Rental Service */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300"
              >
                <div className="relative h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
                    alt="Luxury Car"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <FaCar className="text-4xl text-orange-600 mr-4" />
                    <h3 className="text-2xl font-bold text-gray-900">Car Rental</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Choose from our wide range of well-maintained luxury and economy cars for your journey
                  </p>
                  <ul className="space-y-4">
                    <motion.li 
                      whileHover={{ x: 10 }}
                      className="flex items-center text-gray-600"
                    >
                      <FaShieldAlt className="mr-3 text-orange-500" />
                      Comprehensive insurance coverage
                    </motion.li>
                    <motion.li 
                      whileHover={{ x: 10 }}
                      className="flex items-center text-gray-600"
                    >
                      <FaTools className="mr-3 text-orange-500" />
                      Regular maintenance and cleaning
                    </motion.li>
                    <motion.li 
                      whileHover={{ x: 10 }}
                      className="flex items-center text-gray-600"
                    >
                      <FaRoute className="mr-3 text-orange-500" />
                      Flexible pickup and drop-off locations
                    </motion.li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600 font-semibold">Starting from $50/day</span>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Book Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Bike Rental Service */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300"
              >
                <div className="relative h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Motorcycle"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <FaMotorcycle className="text-4xl text-orange-600 mr-4" />
                    <h3 className="text-2xl font-bold text-gray-900">Bike Rental</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Explore the city with our efficient and reliable bikes
                  </p>
                  <ul className="space-y-4">
                    <motion.li 
                      whileHover={{ x: 10 }}
                      className="flex items-center text-gray-600"
                    >
                      <MdSecurity className="mr-3 text-orange-500" />
                      Safety gear provided
                    </motion.li>
                    <motion.li 
                      whileHover={{ x: 10 }}
                      className="flex items-center text-gray-600"
                    >
                      <FaClock className="mr-3 text-orange-500" />
                      Hourly rental options available
                    </motion.li>
                    <motion.li 
                      whileHover={{ x: 10 }}
                      className="flex items-center text-gray-600"
                    >
                      <MdLocalOffer className="mr-3 text-orange-500" />
                      Student discounts available
                    </motion.li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600 font-semibold">Starting from $20/day</span>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Book Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Additional Services */}
          <div>
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold text-gray-900 mb-12 text-center"
            >
              Additional Services
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 24/7 Support */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <FaPhoneAlt className="text-2xl text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">
                  Round-the-clock customer support for emergencies and assistance
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="text-sm text-gray-600">• Emergency roadside assistance</li>
                  <li className="text-sm text-gray-600">• Technical support</li>
                  <li className="text-sm text-gray-600">• Booking assistance</li>
                </ul>
              </motion.div>

              {/* Chauffeur Service */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <FaUserTie className="text-2xl text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Chauffeur Service</h3>
                <p className="text-gray-600">
                  Professional drivers for a comfortable and safe journey
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="text-sm text-gray-600">• Experienced drivers</li>
                  <li className="text-sm text-gray-600">• Corporate packages</li>
                  <li className="text-sm text-gray-600">• Airport transfers</li>
                </ul>
              </motion.div>

              {/* Pickup & Drop */}
              <motion.div 
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <MdLocationOn className="text-2xl text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Pickup & Drop</h3>
                <p className="text-gray-600">
                  Convenient vehicle delivery and collection at your location
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="text-sm text-gray-600">• Door-to-door service</li>
                  <li className="text-sm text-gray-600">• Flexible timing</li>
                  <li className="text-sm text-gray-600">• Multiple locations</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Need More Information?
            </motion.h2>
            <p className="text-gray-600">
              Our team is here to answer any questions you may have about our services
            </p>
          </div>
          <div className="flex justify-center">
            <motion.button 
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors flex items-center"
            >
              <FaPhoneAlt className="mr-2" />
              Contact Us
            </motion.button>
          </div>
        </div>
      </div>
    </LayoutPrazzol>
  );
};

export default ServicesPage;
