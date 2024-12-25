import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";
import profile from "../../images/interviewerProfile.png";
import toast from "react-hot-toast";
import { playSound } from "../../components/common/soundEffect";

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
    <div className="bg-gray-50 shadow rounded-lg p-8 max-w-6xl mx-auto">
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
              className="p-6 rounded-lg shadow-md border bg-white flex flex-col md:flex-row items-center gap-6 transition hover:shadow-lg"
            >
              <img
                src={interviewer.profilePhoto || profile}
                alt={interviewer.firstName}
                className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm"
              />
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-blue-600">
                  {interviewer.firstName}
                </h3>
                <p className="text-gray-700">{interviewer.jobTitle}</p>
                {interviewer.experience && (
                  <p className="text-gray-600">
                    Experience: <span>{interviewer.experience}</span> years
                  </p>
                )}
                {interviewer.price && (
                  <p className="text-gray-600">
                    Pricing:{" "}
                    <span className="text-green-500 font-semibold">
                      ${interviewer.price}
                    </span>
                  </p>
                )}
                <div>
                  <h4 className="text-lg text-gray-800 font-semibold">
                    Available Dates:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {interviewer.availability.dates
                      .slice(0, viewMore[interviewer._id] ? undefined : 4)
                      .map((date) => (
                        <div
                          key={date._id}
                          className="p-3 rounded border shadow-sm bg-gray-100"
                        >
                          <Calendar className="text-blue-500" />
                          <span className="block text-sm text-gray-700">
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
                            className="mt-2 text-xs px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Book Slot
                          </button>
                        </div>
                      ))}
                  </div>
                  {interviewer.availability.dates.length > 4 && (
                    <button
                      onClick={() => toggleViewMore(interviewer._id)}
                      className="mt-3 text-blue-500 text-sm hover:underline"
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-gray-700">
            Page {currentPage} of {totalPages}
          </p>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {modalVisible && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-2xl font-semibold text-blue-600">
              Confirm Interview
            </h3>
            <p className="mt-3">
              <strong>Interviewer:</strong>{" "}
              {
                interviewers.find((i) => i._id === selectedSlot.interviewerId)
                  ?.firstName
              }
            </p>
            <p>
              <strong>Price:</strong> $
              {
                interviewers.find((i) => i._id === selectedSlot.interviewerId)
                  ?.price
              }
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedSlot.date).toLocaleDateString("en-GB")}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {
                interviewers
                  .find((i) => i._id === selectedSlot.interviewerId)
                  ?.availability.dates.find(
                    (d) => d._id === selectedSlot.dateId
                  )?.from
              }{" "}
              -{" "}
              {
                interviewers
                  .find((i) => i._id === selectedSlot.interviewerId)
                  ?.availability.dates.find(
                    (d) => d._id === selectedSlot.dateId
                  )?.to
              }{" "}
              GMT
            </p>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={handleRequestInterview}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setModalVisible(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
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
