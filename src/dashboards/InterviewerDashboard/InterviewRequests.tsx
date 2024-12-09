import { useState } from "react";
import { motion } from "framer-motion";

interface InterviewRequest {
  id: string;
  candidateName: string;
  position: string;
  date: string;
  time: string;
}

interface InterviewRequestsProps {
  requests: InterviewRequest[];
}

const InterviewRequests: React.FC<InterviewRequestsProps> = ({ requests }) => {
  const [responseStatus, setResponseStatus] = useState<Record<string, string>>(
    {}
  );

  const handleResponse = (id: string, action: "accept" | "ignore") => {
    setResponseStatus((prev) => ({
      ...prev,
      [id]: action === "accept" ? "Accepted" : "Ignored",
    }));

    // Simulate API request here (replace with actual API call if needed)
    setTimeout(() => {
      console.log(`Request ${id} has been ${action}.`);
    }, 500);
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
              <div>
                <h3 className="font-medium text-gray-800">
                  {request.candidateName}
                </h3>
                <p className="text-sm text-gray-500">
                  Position: {request.position}
                </p>
                <p className="text-sm text-gray-500">
                  Date: {request.date} | Time: {request.time}
                </p>
              </div>
              {responseStatus[request.id] ? (
                <span
                  className={`text-sm font-medium ${
                    responseStatus[request.id] === "Accepted"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {responseStatus[request.id]}
                </span>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={() => handleResponse(request.id, "accept")}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleResponse(request.id, "ignore")}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Ignore
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
