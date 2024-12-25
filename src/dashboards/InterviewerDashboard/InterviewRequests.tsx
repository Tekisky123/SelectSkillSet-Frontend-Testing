import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../components/common/axiosConfig";

interface InterviewRequest {
  id: string;
  candidateName: string;
  profilePhoto: string;
  position: string;
  date: string;
  day: string;
  status: string;
}

const InterviewRequests: React.FC = () => {
  const [requests, setRequests] = useState<InterviewRequest[]>([]);
  const [responseStatus, setResponseStatus] = useState<Record<string, string>>(
    () => {
      // Load saved statuses from localStorage on initial load
      const savedStatus = localStorage.getItem("interviewStatus");
      return savedStatus ? JSON.parse(savedStatus) : {};
    }
  );

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get(
          "/interviewer/getInterviewRequests"
        );

        if (response.data && Array.isArray(response.data.interviewRequests)) {
          setRequests(response.data.interviewRequests);
        } else {
          console.error(
            "Invalid response format: 'interviewRequests' is missing or not an array."
          );
        }
      } catch (error) {
        console.error("Error fetching interview requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleResponse = async (
    id: string,
    action: "Approved" | "Cancelled"
  ) => {
    try {
      const payload = {
        interviewRequestId: id,
        status: action,
      };

      const response = await axiosInstance.put(
        "/interviewer/updateInterviewRequest",
        payload
      );

      if (response.data.success) {
        if (action === "Approved") {
          const googleOAuthUrl = `https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=http%3A%2F%2Flocalhost%3A5173&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar&access_type=offline&service=lso&o2v=1&ddm=1&flowName=GeneralOAuthFlow`;
          window.location.href = googleOAuthUrl;
        }
      } else {
        console.error("Failed to update request:", response.data.message);
      }
    } catch (error) {
      console.error("Error handling response for request:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Interview Requests
      </h2>
      {requests.length > 0 ? (
        <div className="space-y-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex-shrink-0">
                <img
                  src={request.profilePhoto}
                  alt={`${request.candidateName} profile`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                />
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">
                  {request.candidateName}
                </h3>
                <p className="text-sm text-gray-600">
                  Position: {request.position}
                </p>
                <p className="text-sm text-gray-600">
                  Date: <strong>{request.date}</strong> ({request.day})
                </p>
              </div>
              {responseStatus[request.id] ? (
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    responseStatus[request.id] === "Approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {responseStatus[request.id]}
                </span>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleResponse(request.id, "Approved")}
                    className={`px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition ${
                      responseStatus[request.id] ? "cursor-not-allowed" : ""
                    }`}
                    disabled={!!responseStatus[request.id]} // Disable button if status already set
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleResponse(request.id, "Cancelled")}
                    className={`px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition ${
                      responseStatus[request.id] ? "cursor-not-allowed" : ""
                    }`}
                    disabled={!!responseStatus[request.id]} // Disable button if status already set
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          No interview requests at the moment.
        </p>
      )}
    </motion.div>
  );
};

export default InterviewRequests;
