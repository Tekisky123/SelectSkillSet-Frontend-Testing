import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#0077B5] to-[#005885] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to take the next step in your journey?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-[#0077B5] rounded-lg font-semibold
                       transform transition-all duration-200 hover:scale-105
                       shadow-lg hover:shadow-xl"
            >
              Sign Up Now
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold
                       transform transition-all duration-200 hover:scale-105 hover:bg-white
                       hover:text-[#0077B5] shadow-lg hover:shadow-xl"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};