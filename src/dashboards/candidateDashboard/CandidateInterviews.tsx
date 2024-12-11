import { useEffect, useState } from "react";
import { Calendar, TimerIcon } from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";
import profile from "../../images/interviewerProfile.png"

interface Interviewer {
  _id: string;
  firstName: string;
  experience?: string;
  price?: string;
  profilePhoto?: string;
  availability: {
    dateFrom: string;
    dateTo: string;
    timeFrom: string;
    timeTo: string;
    status: string;
  };
}

const CandidateInterviews = () => {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const response = await axiosInstance.get("/candidate/interviewers");
        if (response.data.success) {
          setInterviewers(response.data.interviewers);
        } else {
          setError("Failed to fetch interviewers.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching interviewers.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewers();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Schedule Interview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewers.map((interviewer) => {
          const isAvailable = interviewer.availability.status === "available";

          return (
            <div
              key={interviewer._id}
              className={`p-6 rounded-lg shadow-md transition-all ${
                isAvailable
                  ? "border-2 border-green-500 bg-green-50"
                  : "border-2 border-red-500 bg-red-50"
              }`}
            >
              <img
                src={
                  interviewer.profilePhoto || profile
                }
                alt={interviewer.firstName}
                className="w-16 h-16 rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-[#0077B5]">
                {interviewer.firstName}
              </h3>
              {interviewer.experience && (
                <p className="text-gray-600">
                  Experience: {interviewer.experience}
                </p>
              )}
              {interviewer.price && (
                <p className="text-gray-500">Pricing: ${interviewer.price}</p>
              )}
              <div className="mt-4 text-sm text-gray-600">
                <Calendar className="w-4 h-4 inline mr-2" />
                {new Date(
                  interviewer.availability.dateFrom
                ).toLocaleDateString()}{" "}
                to{" "}
                {new Date(interviewer.availability.dateTo).toLocaleDateString()}
                <br />
                <TimerIcon className="w-4 h-4 inline mr-2" />{" "}
                {interviewer.availability.timeFrom} -{" "}
                {interviewer.availability.timeTo}
              </div>
              <button
                className={`mt-4 w-full py-2 rounded-lg transition-all ${
                  isAvailable
                    ? "bg-[#00b53c] text-white hover:bg-[#005885]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!isAvailable}
              >
                {isAvailable ? "Schedule Interview" : "Not Available"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CandidateInterviews;
