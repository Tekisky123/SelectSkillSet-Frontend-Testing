import { useState, useEffect } from "react";
import { Upload, Link as LinkIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../components/common/axiosConfig";

const EditCandidateProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("candidateToken");

  const allowedUpdates = [
    "firstName",
    "lastName",
    "email",
    "jobTitle",
    "location",
    "mobile",
    "profilePhoto",
  ];

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    location: "",
    mobile: "",
    profilePhoto: "",
  });

  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/candidate/getProfile");
        setProfile(response.data.profile);
      } catch (error) {
        toast.error("Failed to load profile. Please try again later.");
      }
    };
    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10,15}$/;

    if (
      !profile.firstName ||
      !profile.lastName ||
      !profile.email ||
      !profile.mobile
    ) {
      toast.error("All fields are required.");
      return;
    }

    if (!emailRegex.test(profile.email)) {
      toast.error("Invalid email format.");
      return;
    }

    if (!mobileRegex.test(profile.mobile)) {
      toast.error("Invalid mobile number.");
      return;
    }

    try {
      const updatedData = Object.fromEntries(
        Object.entries(profile).filter(([key]) => allowedUpdates.includes(key))
      );

      await axiosInstance.put("/candidate/updateProfile", updatedData);

      toast.success("Profile updated successfully!");
      navigate("/candidate-dashboard");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
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
          Edit Candidate Profile
        </h2>
        <div className="space-y-6">
          {allowedUpdates.map(
            (field) =>
              field !== "profilePhoto" && (
                <div key={field} className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    value={profile[field] || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, [field]: e.target.value })
                    }
                    className="text-gray-800 p-4 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
                  />
                </div>
              )
          )}

          <div className="space-y-4">
            <label className="font-medium text-gray-700">Profile Photo</label>
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Upload from Device */}
              <label className="flex items-center justify-center w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-all cursor-pointer">
                <Upload className="w-5 h-5 mr-2" />
                Upload from Device
                <input
                  type="file"
                  className="hidden"
                  onChange={handleUploadPhoto}
                />
              </label>
              {/* Enter Photo URL */}
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Enter Photo URL"
                  className="text-gray-800 p-4 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 transition-all"
                  onClick={handlePhotoUrlSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              className="w-full sm:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onClick={handleSave}
            >
              Save Changes
            </button>
            <button
              className="w-full sm:w-auto bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              onClick={() => navigate("/candidate-dashboard")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EditCandidateProfile;
