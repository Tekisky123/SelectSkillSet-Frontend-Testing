import { motion } from "framer-motion";

interface InterviewerStatisticsProps {
  completedInterviews: number;
  pendingRequests: number;
  totalAccepted: number;
}

const InterviewerStatistics: React.FC<InterviewerStatisticsProps> = ({
  completedInterviews,
  pendingRequests,
  totalAccepted,
}) => {
  const stats = [
    {
      label: "Completed Interviews",
      value: completedInterviews,
      bgColor: "bg-blue-500",
    },
    {
      label: "Pending Requests",
      value: pendingRequests,
      bgColor: "bg-yellow-500",
    },
    {
      label: "Total Accepted",
      value: totalAccepted,
      bgColor: "bg-green-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md rounded-lg p-6"
    >
      <h2 className="text-xl font-semibold mb-6">Your Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} text-white p-4 rounded-lg shadow-md`}
          >
            <h3 className="text-2xl font-bold text-center">{stat.value}</h3>
            <p className="text-center mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default InterviewerStatistics;
