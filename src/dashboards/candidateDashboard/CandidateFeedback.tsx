import { Star } from "lucide-react";

interface Feedback {
    id: number;
    interviewee: string;
    feedbackData: string;
    rating: number;
  }
  
  interface CandidateFeedbackProps {
    feedbacks: Feedback[];
  }
  
  const CandidateFeedback = ({ feedbacks }: CandidateFeedbackProps) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Feedback</h2>
        <div className="space-y-4">
          {feedbacks.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-md hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{item.interviewee}</h3>
              <p className="text-gray-600">{item.feedbackData}</p>
              <div className="mt-2 flex items-center gap-1 text-yellow-500">
                {Array.from({ length: item.rating }, (_, i) => (
                  <Star key={i} className="w-4 h-4" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default CandidateFeedback;
  