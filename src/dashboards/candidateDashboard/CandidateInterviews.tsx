import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";
import profile from "../../images/interviewerProfile.png";
import toast from "react-hot-toast";
import { playSound } from "../../components/common/soundEffect";
import { Link } from "react-router-dom";

interface AvailabilityDate {
  _id: string;
  date: string;
  from: string;
  to: string;
}

interface Interviewer {
  _id: string;
  firstName: string;
  experience?: string;
  jobTitle?: string;
  price?: string;
  profilePhoto?: string;
  availability: {
    dates: AvailabilityDate[];
  };
}

const CandidateInterviews = () => {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMore, setViewMore] = useState<{ [key: string]: boolean }>({});
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const itemsPerPage = 3;

  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const response = await axiosInstance.get("/candidate/interviewers");
        if (response.data.success) {
          if (response.data.interviewers.length === 0) {
            setError("No interviewers available at the moment.");
          } else {
            setInterviewers(response.data.interviewers);
          }
        } else {
          setError("Failed to fetch interviewers.");
        }
      } catch (err) {
        setError("No interviewers found");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewers();
  }, []);

  const handleBookSlot = (
    interviewerId: string,
    dateId: string,
    date: string,
    from: string,
    to: string
  ) => {
    setSelectedSlot({ interviewerId, dateId, date, from, to });
    setModalVisible(true);
  };

  const handleRequestInterview = async () => {
    if (!selectedSlot || !selectedSlot.interviewerId) {
      toast.error("Please select a valid slot!");
      return;
    }

    const interviewer = interviewers.find(
      (i) => i._id === selectedSlot.interviewerId
    );

    if (!interviewer) {
      toast.error("Interviewer not found!");
      return;
    }

    try {
      const response = await axiosInstance.post("/candidate/schedule", {
        interviewerId: selectedSlot.interviewerId,
        date: selectedSlot.date,
        price: interviewer.price,
        from: selectedSlot.from,
        to: selectedSlot.to,
      });

      if (response.data.success) {
        toast.success("Interview scheduled successfully!");
        playSound();
        setModalVisible(false);
      } else {
        if (response.data.message) {
          toast.error(response.data.message);
        } else {
          toast.error("Failed to schedule the interview.");
        }
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInterviewers = interviewers.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(interviewers.length / itemsPerPage);

  const toggleViewMore = (interviewerId: string) => {
    setViewMore((prev) => ({
      ...prev,
      [interviewerId]: !prev[interviewerId],
    }));
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-6xl mx-auto">
      <h2 className="text-4xl font-semibold text-blue-600 mb-8 text-center">
        Schedule an Interview
      </h2>

      {error ? (
        <div className="text-center text-red-500 font-medium">{error}</div>
      ) : (
        <div className="space-y-8">
          {paginatedInterviewers.map((interviewer) => (
            <div
              key={interviewer._id}
              className="p-6 rounded-lg shadow-lg border bg-white flex flex-col md:flex-row  gap-6 transition-all duration-300 hover:shadow-xl"
            >
              <img
                src={interviewer.profilePhoto || profile}
                alt={interviewer.firstName}
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow-md"
              />
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-blue-700">
                  {interviewer.firstName}
                </h3>
                <p className="text-gray-600">{interviewer.jobTitle}</p>
                {interviewer.experience && (
                  <p className="text-gray-500">
                    Experience: <span>{interviewer.experience}</span>
                  </p>
                )}
                {interviewer.price && (
                  <p className="text-gray-500">
                    Pricing:{" "}
                    <span className="text-green-600 font-semibold">
                      {interviewer.price}
                    </span>
                  </p>
                )}
                <div>
                  <h4 className="text-lg text-gray-800 font-semibold">
                    Available Dates:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {interviewer.availability.dates
                      .slice(0, viewMore[interviewer._id] ? undefined : 4)
                      .map((date) => (
                        <div
                          key={date._id}
                          className="p-4 rounded-lg shadow-md bg-gray-50 hover:bg-gray-100 transition duration-200"
                        >
                          <Calendar className="text-blue-500" />
                          <span className="block text-sm text-gray-700 mt-1">
                            {new Date(date.date).toLocaleDateString("en-GB")}
                          </span>
                          <div className="text-xs text-gray-500">
                            {date.from} - {date.to}
                          </div>
                          <button
                            onClick={() =>
                              handleBookSlot(
                                interviewer._id,
                                date._id,
                                date.date,
                                date.from,
                                date.to
                              )
                            }
                            className="mt-2 text-xs px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                          >
                            Book Slot
                          </button>
                        </div>
                      ))}
                  </div>
                  {interviewer.availability.dates.length > 4 && (
                    <button
                      onClick={() => toggleViewMore(interviewer._id)}
                      className="mt-3 text-blue-600 text-sm font-semibold hover:underline transition duration-200"
                    >
                      {viewMore[interviewer._id] ? "View Less" : "View More"}
                    </button>
                  )}
                </div>
              </div>
              <Link
                to={`/interviewer-profile/${interviewer._id}`}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium underline"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}

      {interviewers.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-gray-700">
            Page {currentPage} of {totalPages}
          </p>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {modalVisible && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              Confirm Interview Slot
            </h3>
            <div className="mt-4">
              <p>
                <strong>Interviewer:</strong>{" "}
                {
                  interviewers.find((i) => i._id === selectedSlot.interviewerId)
                    ?.firstName
                }
              </p>
              <p>
                <strong>Slot:</strong> {selectedSlot.date} | {selectedSlot.from}{" "}
                - {selectedSlot.to}
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-6">
              <button
                onClick={() => setModalVisible(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestInterview}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateInterviews;
