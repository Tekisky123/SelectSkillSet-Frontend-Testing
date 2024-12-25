import { useState, useEffect } from "react";
import { Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../components/common/axiosConfig";
import { countryData } from "../../components/common/countryData"; // Import countryData

const EditInterviewerProfile = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("interviewerToken");

  const allowedUpdates = [
    "firstName",
    "lastName",
    "jobTitle",
    "location",
    "mobile",
    "profilePhoto",
    "experience",
    "price",
    "countryCode", // Add countryCode to the list of allowed updates
  ];

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    location: "",
    mobile: "",
    profilePhoto: "",
    experience: "",
    price: "",
    countryCode: "", // Add countryCode to profile state
  });

  const [photoUrl, setPhotoUrl] = useState("");
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  // State for the selected country
  const [selectedCountry, setSelectedCountry] = useState(countryData[0]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/interviewer/getProfile");
        setProfile({
          ...response.data.profile,
          countryCode: response.data.profile.countryCode || countryData[0].code, // Ensure countryCode is part of the profile
        });
        setSelectedCountry(
          countryData.find(
            (item) => item.code === response.data.profile.countryCode
          ) || countryData[0]
        );
      } catch (error) {
        toast.error("Failed to load profile. Please try again later.");
      }
    };
    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    const mobileRegex = /^[0-9]{10,15}$/;
    const priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

    if (
      !profile.firstName ||
      !profile.lastName ||
      !profile.mobile ||
      !profile.experience ||
      !profile.price
    ) {
      toast.error("All fields are required.");
      return;
    }

    if (!mobileRegex.test(profile.mobile)) {
      toast.error("Invalid mobile number.");
      return;
    }

    if (!priceRegex.test(profile.price)) {
      toast.error("Invalid price format.");
      return;
    }

    try {
      const updatedData = Object.fromEntries(
        Object.entries(profile).filter(([key]) => allowedUpdates.includes(key))
      );

      // Ensure countryCode is included separately in the payload
      updatedData.countryCode = selectedCountry.code;

      const response = await axiosInstance.put(
        "/interviewer/updateProfile",
        updatedData
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        navigate("/interviewer-dashboard");
      } else {
        toast.error(
          response.data.message || "Failed to update profile. Please try again."
        );
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const country = countryData.find((item) => item.code === countryCode);
    setSelectedCountry(country || countryData[0]);
  };

  const handleMobileChange = (e) => {
    const input = e.target.value;
    const regex = new RegExp(`^[0-9]{1,${selectedCountry.maxLength}}$`);
    if (regex.test(input)) {
      setProfile({ ...profile, mobile: input });
    }
  };

  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profilePhoto: URL.createObjectURL(file) });
      toast.success("Profile photo uploaded successfully!");
    }
  };

  const handlePhotoUrlSubmit = () => {
    if (!photoUrl) {
      toast.error("Please enter a valid photo URL.");
      return;
    }

    setProfile({ ...profile, profilePhoto: photoUrl });
    toast.success("Profile photo URL updated successfully!");
    setPhotoUrl("");
  };

  const handleRemovePhoto = () => {
    setProfile({ ...profile, profilePhoto: "" });
    toast.success("Profile photo removed.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10"
    >
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Edit Interviewer Profile
        </h2>

        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-300 mb-4">
            <img
              src={profile.profilePhoto || "default-image.png"}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <button
            className="relative bottom-36 left-10 bg-blue-600 text-white rounded-full p-2"
            onClick={() => setShowPhotoOptions(true)}
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>

        {/* Photo Options Modal */}
        {showPhotoOptions && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
              <h3 className="text-xl font-semibold mb-4">
                Change Profile Photo
              </h3>
              <div className="space-y-4">
                {/* Upload from Device */}
                <div className="flex items-center gap-4">
                  <label className="w-1/3 text-gray-700">
                    Upload from Device
                  </label>
                  <input
                    type="file"
                    className="w-2/3"
                    onChange={handleUploadPhoto}
                  />
                </div>

                {/* Enter URL */}
                <div className="flex items-center gap-4">
                  <label className="w-1/3 text-gray-700">Enter URL</label>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-2/3 p-2 border border-gray-300 rounded-lg"
                    placeholder="Profile Photo URL"
                  />
                </div>

                {/* Remove and Save */}
                <div className="flex justify-between space-x-4 mt-6">
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                    onClick={() => setShowPhotoOptions(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-600 text-white py-2 px-4 rounded-lg"
                    onClick={handleRemovePhoto}
                  >
                    Remove Profile
                  </button>
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                    onClick={handlePhotoUrlSubmit}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-6">
          {allowedUpdates.map(
            (field) =>
              field !== "profilePhoto" &&
              field !== "countryCode" && (
                <div key={field} className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  {field === "mobile" ? (
                    <>
                      {/* Country Code Dropdown */}
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <select
                            value={selectedCountry.code}
                            onChange={handleCountryChange}
                            className="p-3 rounded-lg border border-gray-300"
                          >
                            {countryData.map((country) => (
                              <option
                                key={country.isoCode}
                                value={country.code}
                              >
                                {country.code} {country.name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={profile.mobile || ""}
                            onChange={handleMobileChange}
                            className="p-3 flex-1 rounded-lg border border-gray-300"
                            placeholder="Enter mobile number"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <input
                      type="text"
                      value={profile[field] || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, [field]: e.target.value })
                      }
                      className="text-gray-800 p-4 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
                    />
                  )}
                </div>
              )
          )}
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            className="w-full sm:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSave}
          >
            Save Changes
          </button>
          <button
            className="w-full sm:w-auto bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => navigate("/interviewer-dashboard")}
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EditInterviewerProfile;
