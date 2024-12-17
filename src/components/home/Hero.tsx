import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroBg from "../../images/newBG.jpg";

export const Hero = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    featuresSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="relative min-h-screen flex items-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6"
          >
            Find Your Next Opportunity with{" "}
            <span className="text-[#0077B5]">Tailored Solutions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-12"
          >
            Empowering job seekers, interviewers and corporates to connect
            seamlessly
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/login"
              className="px-8 py-4 bg-[#0077B5] text-white rounded-lg font-semibold 
                         transform transition-all duration-200 hover:scale-105 hover:bg-[#005885]
                         shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              to="/request-demo"
              className="px-8 py-4 border-2 border-[#0077B5] text-[#0077B5] rounded-lg font-semibold
                         transform transition-all duration-200 hover:scale-105 hover:bg-[#0077B5] 
                         hover:text-white shadow-lg hover:shadow-xl"
            >
              Request Demo
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute  left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToFeatures}
        >
          <ChevronDown
            className="w-12 h-12 mt-5 text-[#0077B5] animate-bounce"
            strokeWidth={1.5}
          />
        </motion.div>
      </div>
    </div>
  );
};
