import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const LandingFeature = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        {/* First Feature Section */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col sm:flex-row items-center justify-between mb-20"
        >
          <div className="w-full sm:w-1/2 rounded-lg overflow-hidden shadow-xl transform transition-transform duration-500 hover:scale-105">
            <img
              src="https://keystoneacademic-res.cloudinary.com/image/upload/element/52/52335_1_Top_Up.jpg"
              alt="Professional Network"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full sm:w-1/2 sm:pl-12 mt-10 sm:mt-0">
            <h2 className="text-4xl font-bold text-[#1a73e8] mb-6">
              Build Your Professional Network
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6">
              Connect with like-minded professionals and explore new
              opportunities. Whether you're a job seeker or an employer, our
              platform helps you grow and build valuable relationships.
            </p>
            <Link
              to="/signup"
              className="px-8 py-4 bg-[#1a73e8] text-white rounded-lg font-semibold transform transition-all duration-300 hover:scale-105 hover:bg-[#005885] shadow-lg"
            >
              Join Now
            </Link>
          </div>
        </motion.div>

        {/* Second Feature Section */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col sm:flex-row items-center justify-between mb-20"
        >
          <div className="w-full sm:w-1/2 sm:pr-12 mt-10 mb-10 sm:mt-0">
            <h2 className="text-4xl font-bold text-[#1a73e8] mb-6">
              Accelerate Your Career with Expert Advice
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6">
              Gain invaluable insights and career advice from seasoned
              professionals. Our platform provides access to mentorship and
              guidance to ensure your success.
            </p>
            <Link
              to="/mentorship"
              className="px-8 py-4 bg-[#1a73e8] text-white rounded-lg font-semibold transform transition-all duration-300 hover:scale-105 hover:bg-[#005885] shadow-lg"
            >
              Get Mentored
            </Link>
          </div>
          <div className="w-full sm:w-1/2 rounded-lg overflow-hidden shadow-xl transform transition-transform duration-500 hover:scale-105">
            <img
              src="https://edge.iaap-hq.org/wp-content/uploads/2017/11/career-acceleration-iaap-summit-2018.jpg?w=700&h=369"
              alt="Career Advice"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Third Feature Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col sm:flex-row items-center justify-between"
        >
          <div className="w-full sm:w-1/2 rounded-lg overflow-hidden shadow-xl transform transition-transform duration-500 hover:scale-105">
            <img
              src="https://img.freepik.com/premium-vector/unlock-your-opportunity-concept-with-keyhole-ambitious-woman-running-career-potential_503038-2556.jpg"
              alt="Job Opportunities"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full sm:w-1/2 sm:pl-12 mt-10 sm:mt-0">
            <h2 className="text-4xl font-bold text-[#1a73e8] mb-6">
              Unlock Exclusive Job Opportunities
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6">
              Access thousands of job listings, tailored to your expertise and
              aspirations. Our platform connects you with the best employers in
              the industry.
            </p>
            <Link
              to="/jobs"
              className="px-8 py-4 bg-[#1a73e8] text-white rounded-lg font-semibold transform transition-all duration-300 hover:scale-105 hover:bg-[#005885] shadow-lg"
            >
              Explore Jobs
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
