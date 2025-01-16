import { useState, useEffect } from "react";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../components/common/axiosConfig";
import { skillsData } from "../../components/common/SkillsData";
import Loader from "../../components/ui/Loader"; // Ensure Loader is implemented

const EditCandidateProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    location: "",
    linkedIn: "",
    skills: [],
    resume: null,
  });
  const [existingResume, setExistingResume] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state for API requests
  const [isSaving, setIsSaving] = useState(false); // Loading state while saving

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle field changes
  const handleProfileChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  // Save changes (only send updated fields)
  const handleSave = async () => {
    if (!profile.firstName || !profile.lastName) {
      return toast.error("First name and last name are required.");
    }

    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      if (key === "skills") {
        formData.append(key, JSON.stringify(value)); // Handle skills as JSON
      } else if (key === "resume" && value) {
        formData.append(key, value); // Append resume if it exists
      } else {
        formData.append(key, value);
      }
    });

    setIsSaving(true);
    try {
      await axiosInstance.put("/candidate/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully!");
      navigate("/candidate-dashboard");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle resume upload
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile((prev) => ({ ...prev, resume: file }));
      toast.success("Resume uploaded successfully!");
    }
  };

  // Handle skills input
  const handleSkillInput = (value: string) => {
    setSkillInput(value);
    setSuggestedSkills(
      skillsData.filter(
        (skill) =>
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !profile.skills.includes(skill)
      )
    );
  };

  const handleAddSkill = (skill: string) => {
    const updatedSkills = [...profile.skills, skill];
    setProfile((prev) => ({ ...prev, skills: updatedSkills }));
    setSkillInput("");
    setSuggestedSkills([]);
  };

  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = profile.skills.filter((s) => s !== skill);
    setProfile((prev) => ({ ...prev, skills: updatedSkills }));
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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader /> {/* Loader component when loading profile data */}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Form Fields */}
            {["firstName", "lastName", "jobTitle", "location", "linkedIn"].map(
              (key) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    value={profile[key as keyof typeof profile]}
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

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                className="w-full sm:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? <Loader /> : "Save Changes"}
              </button>
              <button
                className="w-full sm:w-auto bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-400"
                onClick={() => navigate("/candidate-dashboard")}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EditCandidateProfile;
