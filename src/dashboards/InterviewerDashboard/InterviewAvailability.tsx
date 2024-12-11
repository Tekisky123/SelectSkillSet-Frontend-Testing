import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import axiosInstance from "../../components/common/axiosConfig";

interface Availability {
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  status: "available" | "unavailable";
}

interface InterviewAvailabilityProps {
  allAvailability: Availability | null;
}

const InterviewAvailability: React.FC<InterviewAvailabilityProps> = ({
  allAvailability: initialAvailability,
}) => {
  const [availability, setAvailability] = useState<Availability>({
    dateFrom: "",
    dateTo: "",
    timeFrom: "",
    timeTo: "",
    status: "available",
  });

  const [allAvailability, setAllAvailability] = useState<Availability | null>(
    initialAvailability
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvailability({ ...availability, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAvailability({
      ...availability,
      status: e.target.value as "available" | "unavailable",
    });
  };

  const fetchLatestAvailability = async () => {
    try {
      const response = await axiosInstance.get("/interviewer/getAvailability");
      if (response.data && response.data.success) {
        setAllAvailability(response.data.availability);
      }
    } catch (error) {
      console.error("Error fetching latest availability:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/interviewer/addAvailability", availability);
  
      if (response.data && response.data.success) {
        // Update the state with the newly added availability
        setAllAvailability({
          dateFrom: availability.dateFrom,
          dateTo: availability.dateTo,
          timeFrom: availability.timeFrom,
          timeTo: availability.timeTo,
          status: availability.status,
        });
        setIsAccordionOpen(false);
      } else {
        console.error("Failed to update availability.");
      }
    } catch (error) {
      console.error("Error saving availability:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const isPM = hour >= 12;
    const formattedHour = hour % 12 || 12;
    const amPm = isPM ? "PM" : "AM";
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${amPm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md rounded-lg p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Interview Availability</h2>
      </div>

      <div
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        className="flex items-center cursor-pointer text-gray-600"
      >
        <h3 className="text-lg font-semibold mr-2">Set Availability</h3>
        {isAccordionOpen ? <ChevronUp /> : <ChevronDown />}
      </div>

      {isAccordionOpen && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label
              htmlFor="dateFrom"
              className="block text-sm font-medium text-gray-600"
            >
              From Date
            </label>
            <input
              type="date"
              id="dateFrom"
              name="dateFrom"
              value={availability.dateFrom}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>
          <div>
            <label
              htmlFor="dateTo"
              className="block text-sm font-medium text-gray-600"
            >
              To Date
            </label>
            <input
              type="date"
              id="dateTo"
              name="dateTo"
              value={availability.dateTo}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>
          <div>
            <label
              htmlFor="timeFrom"
              className="block text-sm font-medium text-gray-600"
            >
              From Time
            </label>
            <input
              type="time"
              id="timeFrom"
              name="timeFrom"
              value={availability.timeFrom}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>
          <div>
            <label
              htmlFor="timeTo"
              className="block text-sm font-medium text-gray-600"
            >
              To Time
            </label>
            <input
              type="time"
              id="timeTo"
              name="timeTo"
              value={availability.timeTo}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-600"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={availability.status}
              onChange={handleStatusChange}
              className="mt-1 p-2 border rounded-md w-full"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Availability"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold">Your Availability</h3>
        {allAvailability ? (
          <div
            className={`border rounded-lg p-4 ${
              allAvailability.status === "available"
                ? "border-green-500"
                : "border-red-500"
            }`}
          >
            <p className="text-gray-700">
              <span className="font-semibold">From:</span>{" "}
              {`${formatDate(allAvailability.dateFrom)} ${formatTime(
                allAvailability.timeFrom
              )}`}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">To:</span>{" "}
              {`${formatDate(allAvailability.dateTo)} ${formatTime(
                allAvailability.timeTo
              )}`}
            </p>
            <p
              className={`font-semibold ${
                allAvailability.status === "available"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {allAvailability.status === "available"
                ? "Available"
                : "Not Available"}
            </p>
          </div>
        ) : (
          <p>No availability set yet.</p>
        )}
      </div>
    </motion.div>
  );
};

export default InterviewAvailability;
