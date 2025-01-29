import React from 'react';
import { motion } from 'framer-motion';
import LayoutPrazzol from '../../LayoutPrazzol';
import { FaHandshake, FaUsers, FaCar, FaAward, FaPhoneAlt } from 'react-icons/fa';
import { MdSecurity, MdTimer, MdLocationOn } from 'react-icons/md';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const AboutPage = () => {
  return (
    <LayoutPrazzol>
      {/* Hero Section with Parallax */}
      <div className="relative h-[60vh] overflow-hidden bg-gradient-to-r from-orange-600 to-orange-400">
        <div className="absolute inset-0 bg-[url('/path-to-your-background.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative h-full flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              About RideHub
            </h1>
            <p className="text-xl text-white opacity-90 max-w-3xl mx-auto px-4 leading-relaxed">
              Your trusted partner in vehicle rentals, making transportation accessible and convenient
            </p>
          </motion.div>
        </div>
      </div>

      {/* Our Story Section with Glass Effect */}
      <div className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="backdrop-blur-md bg-white/80 rounded-3xl p-12 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Founded with a vision to revolutionize the vehicle rental industry, RideHub has grown 
                from a small local business to a leading provider of transportation solutions. Our 
                commitment to quality service and customer satisfaction has helped us build a loyal 
                community of riders who trust us for their mobility needs.
              </p>
            </div>

            {/* Stats Section with Animated Counter */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {[
                { number: "5000+", label: "Happy Customers" },
                { number: "500+", label: "Vehicles" },
                { number: "20+", label: "Cities" },
                { number: "4.8/5", label: "Customer Rating" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center transform hover:scale-105 transition-transform duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Core Values Section with Floating Cards */}
      <div className="py-20 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-16 text-center"
            {...fadeInUp}
          >
            Our Core Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <MdSecurity />, title: "Safety First", description: "We prioritize the safety of our customers with well-maintained vehicles and comprehensive insurance coverage." },
              { icon: <FaHandshake />, title: "Customer Trust", description: "Building long-lasting relationships through transparency, reliability, and exceptional service." },
              { icon: <MdTimer />, title: "Efficiency", description: "Quick and hassle-free booking process with 24/7 customer support for your convenience." }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="group backdrop-blur-md bg-white/90 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl text-white">{value.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section with Glass Cards */}
      <div className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-16 text-center"
            {...fadeInUp}
          >
            Our Leadership Team
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Prajwal Pokhrel", role: "CEO & Founder", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
              { name: "Sanjiv Jung Basnet", role: "Chief Operations Officer", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
              { name: "Sannosam Sojhe Rai", role: "Chief Technology Officer", image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
            ].map((member, index) => (
              <motion.div
                key={index}
                className="text-center backdrop-blur-md bg-white/90 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-gray-600 leading-relaxed">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Join thousands of satisfied customers who trust RideHub for their transportation needs
            </p>
            <div className="flex justify-center space-x-4">
              <motion.button 
                className="px-8 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaCar className="mr-2" />
                Rent Now
              </motion.button>
              <motion.button 
                className="px-8 py-3 border-2 border-orange-600 text-orange-600 rounded-full hover:bg-orange-600 hover:text-white transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPhoneAlt className="mr-2" />
                Contact Us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </LayoutPrazzol>
  );
};

export default AboutPage;