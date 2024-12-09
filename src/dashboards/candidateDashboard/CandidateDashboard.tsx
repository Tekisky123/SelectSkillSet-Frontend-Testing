import { useState, useEffect } from "react";
import { Briefcase, Edit, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CandidateInterviews from "./CandidateInterviews";
import CandidateStatistics from "./CandidateStatistics";
import CandidateFeedback from "./CandidateFeedback";
import axiosInstance from "../../components/common/axiosConfig";

const CandidateDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("candidateToken");

      if (!token) {
        navigate("/login"); 
        return;
      }

      try {
        const response = await axiosInstance.get("/candidate/getProfile");

        // Check if the response is successful
        if (response.data && response.data.success) {
          const profileData = response.data.profile;

          setProfile({
            name: `${profileData.firstName || ""} ${
              profileData.lastName || ""
            }`.trim(),
            email: profileData.email,
            location: profileData.location || "Location not provided",
            mobile: profileData.mobile || "Mobile not provided",
            jobTitle: profileData.jobTitle || "Job title not provided",
            profilePhoto: profileData.profilePhoto || "",
            scheduledInterviews: profileData.scheduledInterviews || [],
            completedInterviews:
              profileData.statistics.monthlyStatistics.completedInterviews || 0,
            averageRating:
              profileData.statistics.monthlyStatistics.averageRating || 0,
            feedbackCount:
              profileData.statistics.monthlyStatistics.feedbackCount || 0,
            feedback: profileData.statistics.feedbacks || [],
          });
        } else {
          setError("Failed to fetch profile data. Please check the response.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err); 
        setError(
          "An error occurred while fetching the profile. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-100"
    >
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4 h-full bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-300 mb-4">
                <img
                  src={
                    profile.profilePhoto ||
                    "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/f8239007-7d36-45ce-a0a1-fdf91052b10e/299f5e14-73c4-4a9b-99c9-e44adbc218cf.png"
                  }
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <h2 className="text-xl font-semibold text-center">
                {profile.name}
              </h2>
              <p className="text-gray-500 text-center">{profile.jobTitle}</p>
              <button
                className="mt-4 text-[#0077B5] hover:text-[#005885] flex items-center"
                onClick={() => navigate("/edit-profile")}
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-5 h-5 mr-2" />
                {profile.mobile}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                {profile.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="w-5 h-5 mr-2" />
                {profile.jobTitle}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Details</h2>
              <div className="space-y-4">
                {[
                  { label: "Full Name", value: profile.name },
                  { label: "Email", value: profile.email },
                  { label: "Location", value: profile.location },
                  { label: "Mobile", value: profile.mobile },
                  {
                    label: "LinkedIn",
                    value: profile.linkedIn ? (
                      <a href={profile.linkedIn} className="text-blue-500">
                        {profile.linkedIn}
                      </a>
                    ) : (
                      "Not Provided"
                    ),
                  },
                  {
                    label: "Resume",
                    value: profile.resume ? (
                      <a href={profile.resume} className="text-blue-500">
                        Download Resume
                      </a>
                    ) : (
                      "Not Provided"
                    ),
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-600">
                      {item.label}
                    </span>
                    <span className="text-gray-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <CandidateInterviews interviews={profile.scheduledInterviews} />

            <CandidateStatistics
              completedInterviews={profile.completedInterviews || 0}
              averageRating={profile.averageRating || 0}
              feedbackCount={profile.feedbacks ? profile.feedbacks.length : 0} // Passing the count as a number
              feedbacks={profile.feedbacks || []}
            />

            <CandidateFeedback feedbacks={profile.feedback} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CandidateDashboard;
