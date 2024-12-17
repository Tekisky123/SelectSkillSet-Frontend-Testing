import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";
import profile from "../../images/interviewerProfile.png";
import toast from "react-hot-toast";
import { playSound } from "../../components/common/soundEffect";

interface AvailabilityDate {
  _id: string;
  date: string;
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
    date: string
  ) => {
    setSelectedSlot({ interviewerId, dateId, date });
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
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-[#0077B5] mb-8 text-center">
        Schedule an Interview
      </h2>

      {error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="space-y-8">
          {paginatedInterviewers.map((interviewer) => (
            <div
              key={interviewer._id}
              className="p-6 rounded-lg shadow-lg border border-gray-200 bg-gradient-to-r from-white to-gray-100 flex flex-col md:flex-row items-center gap-6"
            >
              <img
                src={interviewer.profilePhoto || profile}
                alt={interviewer.firstName}
                className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-md"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#0077B5]">
                  {interviewer.firstName}
                </h3>
                <p className="text-gray-600">{interviewer.jobTitle}</p>
                {interviewer.experience && (
                  <p className="text-gray-600 mt-1">
                    Experience: {interviewer.experience} years
                  </p>
                )}
                {interviewer.price && (
                  <p className="text-gray-600 mt-1">
                    Pricing:{" "}
                    <span className="font-bold text-green-600">
                      ${interviewer.price}
                    </span>
                  </p>
                )}
                <div className="mt-4">
                  <h4 className="text-gray-800 font-semibold mb-2">
                    Available Dates:
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {interviewer.availability.dates
                      .slice(0, viewMore[interviewer._id] ? undefined : 6)
                      .map((date) => {
                        return (
                          <div
                            key={date._id}
                            className="p-2 bg-gray-100 rounded-lg flex flex-col items-center shadow-sm border border-gray-300"
                          >
                            <Calendar className="w-5 h-5 text-[#0077B5]" />
                            <span className="text-sm text-gray-700 mt-1">
                              {new Date(date.date).toLocaleDateString("en-GB")}
                            </span>
                            <button
                              onClick={() =>
                                handleBookSlot(
                                  interviewer._id,
                                  date._id,
                                  date.date
                                )
                              }
                              className="mt-2 text-xs py-1 px-3 rounded-lg transition bg-[#0077B5] text-white hover:bg-[#005885]"
                            >
                              Book Slot
                            </button>
                          </div>
                        );
                      })}
                  </div>

                  {interviewer.availability.dates.length > 6 && (
                    <button
                      onClick={() => toggleViewMore(interviewer._id)}
                      className="mt-4 text-sm text-[#0077B5] hover:underline"
                    >
                      {viewMore[interviewer._id] ? "View Less" : "View More"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {interviewers.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="py-2 px-4 bg-[#0077B5] text-white rounded-lg hover:bg-[#005885] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <p className="text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="py-2 px-4 bg-[#0077B5] text-white rounded-lg hover:bg-[#005885] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {modalVisible && selectedSlot && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h3 className="text-2xl font-bold text-[#0077B5] mb-4">
              Interview with{" "}
              {
                interviewers.find((i) => i._id === selectedSlot.interviewerId)
                  ?.firstName
              }
            </h3>
            <img
              src={
                interviewers.find((i) => i._id === selectedSlot.interviewerId)
                  ?.profilePhoto || profile
              }
              alt="Interviewer Profile"
              className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-md mb-4"
            />
            <p>
              <strong>Price:</strong> $
              {
                interviewers.find((i) => i._id === selectedSlot.interviewerId)
                  ?.price
              }
            </p>
            <p>
              <strong>Scheduled Date:</strong>{" "}
              {new Date(selectedSlot.date).toLocaleDateString("en-GB")}
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Please confirm that the interviewer has accepted the request. If
                declined, the interview will be canceled.
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleRequestInterview}
                className="py-2 px-4 bg-[#0077B5] text-white rounded-lg hover:bg-[#005885]"
              >
                Confirm
              </button>
              <button
                onClick={() => setModalVisible(false)}
                className="ml-4 py-2 px-4 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateInterviews;
