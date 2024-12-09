import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement } from 'chart.js';

// Register the required chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement
);

interface CandidateStatisticsProps {
  completedInterviews: number;
  averageRating: number;
  feedbackCount: number; // Now it's a number
  feedbacks: Array<{ feedbackData: string, rating: number }>;
}

const CandidateStatistics: React.FC<CandidateStatisticsProps> = ({
  completedInterviews,
  averageRating,
  feedbackCount,
  feedbacks,
}) => {
  const barChartData = {
    labels: ['Completed Interviews'],
    datasets: [
      {
        label: 'Completed Interviews',
        data: [completedInterviews],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const radarChartData = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        label: 'Feedback Ratings',
        data: [
          feedbacks?.filter((feedback) => feedback.rating === 1).length,
          feedbacks?.filter((feedback) => feedback.rating === 2).length,
          feedbacks?.filter((feedback) => feedback.rating === 3).length,
          feedbacks?.filter((feedback) => feedback.rating === 4).length,
          feedbacks?.filter((feedback) => feedback.rating === 5).length,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 space-y-8 max-w-4xl mx-auto transition-transform transform">
      <h2 className="text-3xl font-semibold text-gray-800 tracking-tight text-center">Candidate Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart - Completed Interviews */}
        <div className="p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-medium text-gray-700 mb-4">Completed Interviews</h3>
          <Bar data={barChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Completed Interviews' } } }} />
        </div>

        {/* Radar Chart - Feedback Ratings */}
        <div className="p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-medium text-gray-700 mb-4">Feedback Ratings</h3>
          <Radar data={radarChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Feedback Ratings' } } }} />
        </div>
      </div>

      <div className="space-y-4">
        {/* Average Rating */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <span className="font-medium text-gray-600">Average Rating</span>
          <span className="text-lg font-semibold text-gray-800">{averageRating}</span>
        </div>

        {/* Feedback Count */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <span className="font-medium text-gray-600">Feedback Count</span>
          <span className="text-lg font-semibold text-gray-800">{feedbackCount}</span>
        </div>

        {/* Total Interviews */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <span className="font-medium text-gray-600">Total Interviews</span>
          <span className="text-lg font-semibold text-gray-800">{completedInterviews}</span>
        </div>
      </div>
    </div>
  );
};

export default CandidateStatistics;
