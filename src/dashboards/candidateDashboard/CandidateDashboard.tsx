import { useState, useEffect } from "react";
import { Briefcase, Edit, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CandidateFeedback from "./CandidateFeedback";
import profileimg from "../../images/candidateProfile.png";
import axiosInstance from "../../components/common/axiosConfig";
import CandidateInterviews from "./CandidateInterviews";

const CandidateDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [interviewsLoading, setInterviewsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem("candidateToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axiosInstance.get("/candidate/getProfile");

        if (response.data?.success) {
          const profileData = response.data.profile || {};
          setProfile({
            name: `${profileData.firstName || ""} ${
              profileData.lastName || ""
            }`.trim(),
            email: profileData.email || "Email not provided",
            location: profileData.location || "Location not provided",
            mobile: profileData.mobile || "Mobile not provided",
            countryCode: profileData.countryCode || "+00",
            jobTitle: profileData.jobTitle || "Job title not provided",
            profilePhoto: profileData.profilePhoto || profileimg,
            linkedIn: profileData.linkedIn || "",
            scheduledInterviews: profileData.scheduledInterviews || [],
            completedInterviews:
              profileData.statistics?.monthlyStatistics?.completedInterviews ||
              0,
            averageRating:
              profileData.statistics?.monthlyStatistics?.averageRating || 0,
            feedbackCount:
              profileData.statistics?.monthlyStatistics?.feedbackCount || 0,
            feedback: profileData.statistics?.feedbacks || [],
          });
        } else {
          setError("Failed to fetch profile data.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("An error occurred while fetching the profile.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchInterviews = async () => {
      try {
        const response = await axiosInstance.get("/candidate/myInterviews");
        if (response.data?.success) {
          setInterviews(response.data.interviews || []);
        } else {
          setError("Failed to fetch interviews data.");
        }
      } catch (err) {
        console.error("Error fetching interviews:", err);
        setError("An error occurred while fetching interviews.");
      } finally {
        setInterviewsLoading(false);
      }
    };

    fetchProfile();
    fetchInterviews();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-600";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 h-max bg-white shadow-lg rounded-lg p-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-300 mb-4">
                <img
                  src={profile.profilePhoto || profileimg}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                {profile.name}
              </h2>
              <p className="text-sm text-gray-600 text-center">
                {profile.jobTitle}
              </p>
              <button
                className="mt-4 text-[#0077B5] hover:text-[#005885] flex items-center"
                onClick={() => navigate("/edit-candidate-profile")}
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
            </div>

            <div className="mt-6 space-y-4 text-gray-600">
              <div className="flex items-center text-sm">
                <Phone className="w-5 h-5 mr-2" />
                {profile.countryCode} {profile.mobile}
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="w-5 h-5 mr-2" />
                {profile.location}
              </div>
              <div className="flex items-center text-sm">
                <Briefcase className="w-5 h-5 mr-2" />
                {profile.jobTitle}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            {/* Profile Details */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Details</h2>
              <div className="space-y-4">
                <table className="min-w-full table-auto border-separate border-spacing-2">
                  <tbody>
                    {[
                      { label: "Full Name", value: profile.name },
                      { label: "Email", value: profile.email },
                      { label: "Location", value: profile.location },
                      {
                        label: "Mobile",
                        value: `${profile.countryCode} ${profile.mobile}`,
                      },
                      {
                        label: "LinkedIn",
                        value: profile.linkedIn ? (
                          <a
                            href={profile.linkedIn}
                            target="_blank"
                            className="text-blue-500 hover:underline"
                          >
                            {new URL(profile.linkedIn).pathname.slice(4)}
                          </a>
                        ) : (
                          "Not Provided"
                        ),
                      },
                      {
                        label: "Resume",
                        value: profile.resume ? (
                          <a
                            href={profile.resume}
                            className="text-blue-500 hover:underline"
                          >
                            Download Resume
                          </a>
                        ) : (
                          "Not Provided"
                        ),
                      },
                    ].map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-4 py-2 text-left font-medium text-gray-600">
                          {item.label}
                        </td>
                        <td className="px-4 py-2 text-left text-gray-700">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                My Upcoming Interviews
              </h3>
              {interviews.length > 0 ? (
                interviews.map((interview) => (
                  <div
                    key={interview.id || Math.random()}
                    className={`p-4 border rounded-lg flex items-center justify-between mb-4 shadow-md ${getStatusColor(
                      interview.status
                    )}`}
                  >
                    <div className="flex items-center">
                      <img
                        src={interview.interviewerPhoto || profileimg}
                        alt={interview.interviewerName || "Interviewer"}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {interview.interviewerName || "N/A"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {interview.date || "TBD"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {interview.from || "Time not specified"} -{" "}
                          {interview.to || "Time not specified"} GMT
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {interview.status}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No scheduled interviews.</p>
              )}
            </div>

            <CandidateInterviews />
            <CandidateFeedback feedbacks={profile.feedback} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CandidateDashboard;
