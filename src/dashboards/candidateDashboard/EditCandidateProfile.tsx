import { useState, useEffect } from "react";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../components/common/axiosConfig";
import { countryData } from "../../components/common/countryData";
import { skillsData } from "../../components/common/SkillsData";

const EditCandidateProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    location: "",
    linkedIn: "",
    skills: [],
    resume: null, // For new upload
  });
  const [existingResume, setExistingResume] = useState(""); // Existing resume from database
  const [skillInput, setSkillInput] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [updatedFields, setUpdatedFields] = useState({}); // Track changes for partial updates

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/candidate/getProfile");
        const {
          firstName = "",
          lastName = "",
          jobTitle = "",
          location = "",
          linkedIn = "",
          skills = [],
          resume = "",
        } = data.profile;

        setProfile({
          firstName,
          lastName,
          jobTitle,
          location,
          linkedIn,
          skills,
          resume: null,
        });
        setExistingResume(resume); // Store the existing resume name
      } catch (error) {
        toast.error("Failed to load profile data. Please try again.");
      }
    };

    fetchProfile();
  }, []);

  // Handle field changes
  const handleProfileChange = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setUpdatedFields((prev) => ({ ...prev, [key]: value })); // Track changed fields
  };

  // Save changes (only send updated fields)
  const handleSave = async () => {
    if (!profile.firstName || !profile.lastName) {
      return toast.error("First name and last name are required.");
    }

    const formData = new FormData();
    Object.entries(updatedFields).forEach(([key, value]) => {
      if (key === "skills") {
        formData.append(key, JSON.stringify(value)); // Handle skills as JSON
      } else if (key === "resume" && value) {
        formData.append(key, value); // Append resume if it exists
      } else {
        formData.append(key, value);
      }
    });

    try {
      await axiosInstance.put("/candidate/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully!");
      navigate("/candidate-dashboard");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // Handle resume upload
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleProfileChange("resume", file);
      toast.success("Resume uploaded successfully!");
    }
  };

  // Handle skills input
  const handleSkillInput = (value) => {
    setSkillInput(value);
    setSuggestedSkills(
      skillsData.filter(
        (skill) =>
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !profile.skills.includes(skill)
      )
    );
  };

  const handleAddSkill = (skill) => {
    const updatedSkills = [...profile.skills, skill];
    handleProfileChange("skills", updatedSkills);
    setSkillInput("");
    setSuggestedSkills([]);
  };

  const handleRemoveSkill = (skill) => {
    const updatedSkills = profile.skills.filter((s) => s !== skill);
    handleProfileChange("skills", updatedSkills);
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

        {/* Form Fields */}
        <div className="space-y-6">
          {["firstName", "lastName", "jobTitle", "location", "linkedIn"].map(
            (key) => (
              <div key={key} className="flex flex-col gap-2">
                <label className="font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  value={profile[key]}
                  onChange={(e) => handleProfileChange(key, e.target.value)}
                  className="text-gray-800 p-4 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
                />
              </div>
            )
          )}

          {/* Skills Section */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Skills</label>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => handleSkillInput(e.target.value)}
              className="text-gray-800 p-4 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start typing to add skills..."
            />
            {suggestedSkills.length > 0 && (
              <ul className="bg-white border border-gray-300 rounded-lg mt-2 max-h-32 overflow-y-auto">
                {suggestedSkills.map((skill) => (
                  <li
                    key={skill}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                    onClick={() => handleAddSkill(skill)}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-600 text-white py-1 px-3 rounded-full flex items-center gap-2"
                >
                  {skill}
                  <XCircle
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => handleRemoveSkill(skill)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Resume Section */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Upload Resume</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="text-gray-800 p-4 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {profile.resume ? (
              <p className="text-sm text-green-600 mt-2">
                {profile.resume.name} is uploaded.
              </p>
            ) : existingResume ? (
              <p className="text-sm text-gray-700 mt-2">
                Current Resume: {existingResume}
              </p>
            ) : null}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            className="w-full sm:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500"
            onClick={handleSave}
          >
            Save Changes
          </button>
          <button
            className="w-full sm:w-auto bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-400"
            onClick={() => navigate("/candidate-dashboard")}
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EditCandidateProfile;
