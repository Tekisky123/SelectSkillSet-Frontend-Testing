import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Table } from "lucide-react";
import "chart.js/auto";
import axiosInstance from "../../components/common/axiosConfig";
import Loader from "../../components/ui/Loader";

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/admin/getAll-details");
        if (response.data.message === "Details fetched successfully") {
          setData(response.data);
          toast.success(response.data.message);
        } else {
          toast.error("Failed to load data");
        }
      } catch (error) {
        toast.error("An error occurred while fetching data");
        console.error(error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <Loader />;
  }

  const {
    totalCandidates,
    totalInterviewers,
    pendingCount,
    completedCount,
    cancelledCount,
    candidates,
    interviewers,
  } = data;

  const barChartData = {
    labels: [
      "Total Candidates",
      "Total Interviewers",
      "Pending",
      "Completed",
      "Cancelled",
    ],
    datasets: [
      {
        label: "Statistics",
        data: [
          totalCandidates,
          totalInterviewers,
          pendingCount,
          completedCount,
          cancelledCount,
        ],
        backgroundColor: [
          "#0073b1",
          "#00a0dc",
          "#7fb9e1",
          "#cce4f7",
          "#174774",
        ],
      },
    ],
  };

  const doughnutChartData = {
    labels: ["Pending", "Completed", "Cancelled"],
    datasets: [
      {
        label: "Interview Status",
        data: [pendingCount, completedCount, cancelledCount],
        backgroundColor: ["#0073b1", "#00a0dc", "#7fb9e1"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#0073b1] mb-8">
          Admin Dashboard
        </h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white shadow-md rounded-lg"
          >
            <h2 className="text-xl font-semibold text-[#0073b1]">
              Total Candidates
            </h2>
            <p className="text-3xl font-bold">{totalCandidates}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white shadow-md rounded-lg"
          >
            <h2 className="text-xl font-semibold text-[#0073b1]">
              Total Interviewers
            </h2>
            <p className="text-3xl font-bold">{totalInterviewers}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white shadow-md rounded-lg"
          >
            <h2 className="text-xl font-semibold text-[#0073b1]">
              Pending Interviews
            </h2>
            <p className="text-3xl font-bold">{pendingCount}</p>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold text-[#0073b1] mb-4">
              Interview Statistics
            </h2>
            <Bar data={barChartData} />
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold text-[#0073b1] mb-4">
              Interview Status
            </h2>
            <Doughnut data={doughnutChartData} />
          </div>
        </div>

        {/* Candidates Table */}
        <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-[#0073b1] mb-4 flex items-center gap-2">
            <Table size={24} /> Candidates List
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#0073b1] text-white">
                  <th className="border border-gray-300 p-3 text-left">Name</th>
                  <th className="border border-gray-300 p-3 text-left">
                    Email
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Job Title
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Location
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Interviews
                  </th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate: any) => (
                  <tr key={candidate._id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-3">
                      {candidate.firstName} {candidate.lastName}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {candidate.email}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {candidate.jobTitle || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {candidate.location || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {candidate.scheduledInterviews.length > 0
                        ? candidate.scheduledInterviews.length
                        : "No Interviews"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interviewer Table */}
        <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-[#0073b1] mb-4 flex items-center gap-2">
            <Table size={24} /> Interviewers List
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#0073b1] text-white">
                  <th className="border border-gray-300 p-3 text-left">Name</th>
                  <th className="border border-gray-300 p-3 text-left">
                    Email
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Job Title
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Location
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    Interviews
                  </th>
                </tr>
              </thead>
              <tbody>
                {interviewers.map((interviewer: any) => (
                  <tr key={interviewer._id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-3">
                      {interviewer.firstName} {interviewer.lastName}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {interviewer.email}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {interviewer.jobTitle || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {interviewer.location || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-3">
                      {interviewer.interviewRequests?.length > 0
                        ? interviewer.interviewRequests.length
                        : "No Interviews"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
