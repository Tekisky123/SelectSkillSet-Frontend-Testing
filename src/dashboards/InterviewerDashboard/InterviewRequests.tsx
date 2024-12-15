import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../components/common/axiosConfig";

// Interface for the InterviewRequest
interface InterviewRequest {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  day: string;
  status: string;
}

const InterviewRequests: React.FC = () => {
  const [requests, setRequests] = useState<InterviewRequest[]>([]);
  const [responseStatus, setResponseStatus] = useState<Record<string, string>>({});

  // Fetch interview requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get("/interviewer/getInterviewRequests");

        if (response.data && Array.isArray(response.data.interviewRequests)) {
          setRequests(response.data.interviewRequests);
        } else {
          console.error("Invalid response format: 'interviewRequests' is missing or not an array.");
        }
      } catch (error) {
        console.error("Error fetching interview requests:", error);
      }
    };

    fetchRequests();
  }, []);

  // Handle approve or cancel action
  const handleResponse = async (id: string, action: "Approved" | "Cancelled") => {
    try {
      const response = await axiosInstance.put(`/interviewer/updateInterviewRequest`, {
        interviewRequestId: id,
        status: action,
      });

      if (response.data.success) {
        setResponseStatus((prev) => ({
          ...prev,
          [id]: action,
        }));

        setTimeout(() => {
          console.log(`Request ${id} has been ${action}.`);
        }, 500);
      }
    } catch (error) {
      console.error(`Error handling response for request ${id}:`, error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md rounded-lg p-6"
    >
      <h2 className="text-xl font-semibold mb-6">Interview Requests</h2>
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex flex-col">
                <h3 className="font-medium text-gray-800">{request.candidateName}</h3>
                <p className="text-sm text-gray-500">Position: {request.position}</p>
                <p className="text-sm text-gray-500">
                  Date: <strong>{request.date}</strong> ({request.day})
                </p>
              </div>
              {responseStatus[request.id] ? (
                <span
                  className={`text-sm font-medium ${
                    responseStatus[request.id] === "Approved"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {responseStatus[request.id]}
                </span>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={() => handleResponse(request.id, "Approved")}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleResponse(request.id, "Cancelled")}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No interview requests at the moment.</p>
      )}
    </motion.div>
  );
};

export default InterviewRequests;
