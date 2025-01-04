import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Adjust if you're not using react-router
import axiosInstance from "../../components/common/axiosConfig";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Loader from "../../components/ui/Loader";

const InterviewerProfile = () => {
  const { id } = useParams(); // Get the interviewer ID from the URL
  const [interviewer, setInterviewer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviewer = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/candidate/getInterviewerProfile/${id}`
        );
        setInterviewer(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching interviewer profile:", err);
        setError("Failed to fetch interviewer profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewer();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 py-12"
          >
            <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-xl space-y-12">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <img
                  src={interviewer.profilePhoto}
                  alt="Profile Picture"
                  className="w-40 h-40 rounded-full border-4 border-indigo-600 object-cover shadow-xl transform transition duration-500 hover:scale-110"
                />
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 hover:text-indigo-600 transition duration-300">
                    {interviewer.firstName} {interviewer.lastName}
                  </h1>
                  <p className="text-xl text-gray-600 mt-2">
                    {interviewer.jobTitle}
                  </p>
                  <p className="text-gray-500 mt-2">
                    Experience: {interviewer.experience}
                  </p>
                </div>
              </div>

              {/* Total Interviews Section */}
              <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-indigo-100 p-6 rounded-xl shadow-md text-center">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Total Interviews
                  </h3>
                  <p className="text-3xl text-indigo-600 mt-2">
                    {interviewer.totalInterviews}
                  </p>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="mb-10">
                <h2 className="text-3xl font-semibold text-gray-800">
                  Interview Pricing
                </h2>
                <p className="text-xl text-gray-600 mt-4">
                  {interviewer.price}
                </p>
              </div>

              {/* Contact Section */}
              <div className="mt-12 text-center">
                <button className="bg-indigo-600 text-white py-3 px-10 rounded-full text-lg hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105">
                  Contact for Interview
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default InterviewerProfile;
