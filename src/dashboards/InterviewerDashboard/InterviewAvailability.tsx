import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Trash } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axiosInstance from "../../components/common/axiosConfig";
import toast from "react-hot-toast";
import TimePicker from "react-time-picker"; 

interface Availability {
  date: string;
  from: string;
  to: string;
  _id: string;
}

const InterviewAvailability: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<
    { date: string; from: string; to: string }[]
  >([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTimeSelection, setCurrentTimeSelection] = useState<{
    from: string;
    to: string;
  }>({
    from: "00:00 AM",
    to: "00:00 AM",
  });

  const formatTimeTo12Hour = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const isPM = hour >= 12;
    const formattedHour = hour % 12 || 12;
    const period = isPM ? "PM" : "AM";
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const fetchAvailabilities = async () => {
    try {
      const response = await axiosInstance.get("/interviewer/getAvailability");
      if (response.data?.success) {
        setAvailabilities(response.data.availability || []);
      }
    } catch (error) {
      toast.error("Error fetching availabilities.");
    }
  };

  const handleDateClick = (date: Date) => {
    const formattedDate = date.toLocaleDateString("en-CA");
    if (
      availabilities.some((avail) => avail.date === formattedDate) ||
      selectedDates.some((d) => d.date === formattedDate)
    ) {
      toast.error("This date is already selected or available.");
      return;
    }

    setSelectedDates((prevDates) =>
      prevDates.find((d) => d.date === formattedDate)
        ? prevDates.filter((d) => d.date !== formattedDate)
        : [
            ...prevDates,
            {
              date: formattedDate,
              from: currentTimeSelection.from,
              to: currentTimeSelection.to,
            },
          ]
    );
  };

  const handleSubmit = async () => {
    if (selectedDates.length === 0) return;

    setIsLoading(true);
    try {
      const payload = selectedDates.map(({ date, from, to }) => ({
        date,
        from, // Already formatted with AM/PM
        to, // Already formatted with AM/PM
      }));

      const response = await axiosInstance.post(
        "/interviewer/addAvailability",
        { dates: payload }
      );
      if (response.data?.success) {
        fetchAvailabilities();
        setSelectedDates([]);
        toast.success("Availabilities saved successfully.");
        setIsAccordionOpen(false);
      } else {
        toast.error("Failed to save availabilities.");
      }
    } catch (error) {
      toast.error("Error saving availabilities.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAvailability = async (date: string) => {
    try {
      const response = await axiosInstance.delete(
        "/interviewer/deleteAvailability",
        {
          data: { date },
        }
      );
      if (response.data?.success) {
        fetchAvailabilities();
        toast.success("Availability deleted successfully.");
      } else {
        toast.error("Failed to delete availability.");
      }
    } catch (error) {
      toast.error("Error deleting availability.");
    }
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto border border-gray-200 "
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-900">
          Availability Scheduler
        </h2>
      </div>

      <div
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        className="flex items-center justify-between bg-gray-100 text-gray-700 px-5 py-3 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200 transition"
      >
        <h3 className="text-lg font-medium">Set Available Dates and Times</h3>
        {isAccordionOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {isAccordionOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 overflow-hidden"
        >
          <p className="text-sm text-gray-600 mb-3">
            Select your available dates and times. Note: Times are in{" "}
            <strong>GMT</strong>.
          </p>
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
            <Calendar
              onClickDay={handleDateClick}
              tileClassName={({ date }) => {
                const formattedDate = date.toLocaleDateString("en-CA");
                if (selectedDates.some((d) => d.date === formattedDate)) {
                  return "bg-blue-600 text-white rounded-full";
                }
                if (
                  availabilities.some((avail) => avail.date === formattedDate)
                ) {
                  return "bg-green-100 text-green-600 rounded-full font-semibold";
                }
                return "hover:bg-gray-100";
              }}
              minDate={new Date()}
              className="w-full mx-auto border-none rounded-lg"
            />
          </div>
          <div className="flex flex-wrap  mt-6 gap-6">
            <div className="w-full">
              <label htmlFor="from" className="block text-sm font-medium">
                From (GMT)
              </label>
              <TimePicker
                id="from"
                value={currentTimeSelection.from}
                onChange={(time) =>
                  setCurrentTimeSelection((prev) => ({
                    ...prev,
                    from: formatTimeTo12Hour(time),
                  }))
                }
                disableClock
                className="w-full border border-gray-300 rounded-lg"
              />
            </div>
            <div className="w-full">
              <label htmlFor="to" className="block text-sm font-medium">
                To (GMT)
              </label>
              <TimePicker
                id="to"
                value={currentTimeSelection.to}
                onChange={(time) =>
                  setCurrentTimeSelection((prev) => ({
                    ...prev,
                    to: formatTimeTo12Hour(time),
                  }))
                }
                disableClock
                className="w-full border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end space-x-3">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
              disabled={isLoading || selectedDates.length === 0}
            >
              {isLoading ? "Saving..." : "Save Dates"}
            </button>
            <button
              onClick={() => setSelectedDates([])}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Clear Selection
            </button>
          </div>
        </motion.div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Your Availabilities
        </h3>
        {availabilities.length > 0 ? (
          <ul className="divide-y divide-gray-200 space-y-4">
            {availabilities.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center py-4 px-5 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition duration-300"
              >
                <span className="text-gray-700 text-sm">
                  {formatDate(item.date)} -{" "}
                  <span className="font-semibold text-gray-900">
                    {item.from}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-900">{item.to}</span>{" "}
                  (GMT)
                </span>
                <button
                  onClick={() => deleteAvailability(item.date)}
                  className="text-red-500 hover:text-red-700 transition duration-300"
                >
                  <Trash size={18} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No availabilities set yet.</p>
        )}
      </div>
    </motion.div>
  );
};

export default InterviewAvailability;
