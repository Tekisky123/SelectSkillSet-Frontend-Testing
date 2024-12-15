import { useState, useEffect } from "react";
import { Briefcase, Edit, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../components/common/axiosConfig";
import InterviewRequests from "./InterviewRequests";
import InterviewerStatistics from "./InterviewerStatistics";
import InterviewerFeedback from "./InterviewerFeedback";
import InterviewAvailability from "./InterviewAvailability";
import profileimg from "../../images/interviewerProfile.png";

const InterviewerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/interviewer/getProfile");

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
            profilePhoto: profileData.profilePhoto || profileimg,
            interviewRequests: profileData.interviewRequests || [],
            completedInterviews:
              profileData.statistics.completedInterviews || 0,
            pendingRequests: profileData.statistics.pendingRequests || 0,
            totalAccepted: profileData.statistics.totalAccepted || 0,
            averageRating: profileData.statistics.averageRating || 0,
            feedbacks: profileData.feedbacks || [],
            availability: profileData.availability,
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
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
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
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/4 h-full bg-white shadow-xl rounded-lg p-6">
            <div className="flex flex-col items-center mb-8 relative">
              <div className="w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden mb-4 relative">
                <img
                  src={profile.profilePhoto}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>

              <h2 className="text-2xl font-semibold text-center">
                {profile.name}
              </h2>
              <p className="text-gray-500 text-center">{profile.jobTitle}</p>

              <button
                className="mt-4 text-[#0077B5] hover:text-[#005885] flex items-center"
                onClick={() => navigate("/edit-interviewer-profile")}
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
            </div>

            <div className="mt-4 space-y-6">
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

          {/* Main Content Area */}
          <div className="flex-1 space-y-10">
            {/* Profile Details */}
            <div className="bg-white shadow-xl rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Profile Details</h2>
              <div className="space-y-4">
                {[
                  { label: "Full Name", value: profile.name },
                  { label: "Email", value: profile.email },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <span className="font-medium text-gray-600">
                      {item.label}
                    </span>
                    <span className="text-gray-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Components */}
            <InterviewAvailability allAvailability={profile.availability} />
            <InterviewRequests requests={profile.interviewRequests} />
            <InterviewerStatistics
              completedInterviews={profile.completedInterviews}
              pendingRequests={profile.pendingRequests}
              totalAccepted={profile.totalAccepted}
            />
            <InterviewerFeedback feedbacks={profile.feedbacks} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewerDashboard;
