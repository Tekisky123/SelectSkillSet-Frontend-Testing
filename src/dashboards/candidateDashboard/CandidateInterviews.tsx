import { Calendar } from "lucide-react";

interface Interview {
    id: number;
    name: string;
    company: string;
    price: string;
    date: string;
    time: string;
  }
  
  interface CandidateInterviewsProps {
    interviews: Interview[];
  }
  
  const CandidateInterviews = ({ interviews }: CandidateInterviewsProps) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Schedule Interview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-gray-50 p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-[#0077B5]">
                {interview.name}
              </h3>
              <p className="text-gray-600">{interview.company}</p>
              <p className="text-gray-500">Pricing: {interview.price}</p>
              <div className="mt-4 text-sm text-gray-600">
                <Calendar className="w-4 h-4 inline mr-2" />
                {interview.date} - {interview.time}
              </div>
              <button className="mt-4 w-full py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#005885] transition-all">
                Schedule Interview
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default CandidateInterviews;
  