import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LayoutPrazzol from '../../LayoutPrazzol';
import { FaCar, FaMotorcycle, FaShieldAlt, FaClock, FaUserFriends } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/animations.css';

// Optimized image URLs with WebP format when possible
const pulsar150 = 'https://th.bing.com/th/id/R.2308f83e1299491576948d33d0002f64?rik=6AVi2cxZJbd14A&pid=ImgRaw&r=0';
const suzukiCar = 'https://th.bing.com/th/id/OIP._2Q30fpKxZxBQkarDErIpwHaEQ?w=311&h=180&c=7&r=0&o=5&pid=1.7';
const bolero = 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/131179/bolero-exterior-right-front-three-quarter.jpeg';
const mt15 = 'https://bd.gaadicdn.com/processedimages/yamaha/mt-15-2-0/source/mt-15-2-062e4b1d700b63.jpg';

// Transparent vehicle images for background
const transparentBike = 'https://th.bing.com/th/id/R.2308f83e1299491576948d33d0002f64?rik=6AVi2cxZJbd14A&pid=ImgRaw&r=0';
const transparentCar = 'https://th.bing.com/th/id/OIP._2Q30fpKxZxBQkarDErIpwHaEQ?w=311&h=180&c=7&r=0&o=5&pid=1.7';
const transparentSportBike = 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/131179/bolero-exterior-right-front-three-quarter.jpeg';
const transparentLuxuryCar = 'https://bd.gaadicdn.com/processedimages/yamaha/mt-15-2-0/source/mt-15-2-062e4b1d700b63.jpg';

// Optimized background SVG patterns
const backgroundPattern = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFA500' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

const vehicles = [
  {
    id: 1,
    image: pulsar150,
    title: 'Pulsar 150',
    type: 'bike'
  },
  {
    id: 2,
    image: suzukiCar,
    title: 'Suzuki Car',
    type: 'car'
  },
  {
    id: 3,
    image: bolero,
    title: 'Bolero',
    type: 'car'
  },
  {
    id: 4,
    image: mt15,
    title: 'MT-15',
    type: 'bike'
  }
];

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % vehicles.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <LayoutPrazzol>
      <div className="relative bg-gradient-to-br from-orange-50 to-white min-h-screen">
        {/* Hero Section with Sliding Images */}
        <div className="relative h-[600px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative h-full">
                <img
                  src={vehicles[currentIndex].image}
                  alt={vehicles[currentIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="text-white max-w-xl">
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl font-bold mb-4"
                      >
                        {vehicles[currentIndex].title}
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl mb-8"
                      >
                        Experience the thrill of riding with our premium {vehicles[currentIndex].type === 'bike' ? 'bikes' : 'cars'}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Link
                          to="/login"
                          className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors duration-300 inline-block"
                        >
                          Rent Now
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {vehicles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? 'bg-orange-600' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Featured Vehicles Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.h2 
            className="text-4xl font-bold text-center text-gray-900 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Featured Vehicles
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Pulsar 150",
                image: pulsar150,
                description: "Powerful performance and comfort",
                alt: "Pulsar 150"
              },
              {
                name: "Suzuki Car",
                image: suzukiCar,
                description: "Elegant and reliable family car",
                alt: "Suzuki Car"
              },
              {
                name: "Bolero",
                image: bolero,
                description: "Rugged and spacious SUV",
                alt: "Bolero"
              },
              {
                name: "MT-15",
                image: mt15,
                description: "Sporty and agile performance",
                alt: "MT-15"
              }
            ].map((vehicle, index) => (
              <motion.div
                key={index}
                className="vehicle-card bg-white rounded-2xl shadow-lg overflow-hidden transform-gpu"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative h-48 bg-gradient-to-br from-orange-50 to-white overflow-hidden">
                  <motion.img
                    src={vehicle.image}
                    alt={vehicle.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent">
                  </div>
                </div>
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
                  <p className="text-gray-600 mt-2">{vehicle.description}</p>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/login"
                      className="mt-4 block text-center bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                      Rent Now
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Features Section */}
          <div className="mt-24">
            <motion.h2
              className="text-4xl font-bold text-center text-gray-900 mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Why Choose RideHub?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: <FaShieldAlt className="text-4xl text-orange-600" />,
                  title: "Safe & Secure",
                  description: "All vehicles are regularly maintained and fully insured"
                },
                {
                  icon: <FaClock className="text-4xl text-orange-600" />,
                  title: "24/7 Support",
                  description: "Round-the-clock customer service for your convenience"
                },
                {
                  icon: <FaUserFriends className="text-4xl text-orange-600" />,
                  title: "Easy Booking",
                  description: "Simple and quick online booking process"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <motion.div
                    className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-orange-100 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutPrazzol>
  );
};

export default HomePage;