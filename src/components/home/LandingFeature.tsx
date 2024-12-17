import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import hrProfetional from "../../images/hrProfetional.jpg";
import candidate from "../../images/candidate.jpg";
import Interviewers from "../../images/Interviewers.jpeg";

const features = [
  {
    title: "How It Works for HR Professionals",
    image: hrProfetional,
    points: [
      {
        title: "Search & Discover Talent",
        description:
          "Browse through a pool of highly-rated candidates, filtered by skills, experience, and interview ratings.",
      },
      {
        title: "Find the Perfect Fit",
        description:
          "Use detailed performance metrics to identify top talent who meet your job requirements.",
      },
      {
        title: "Streamline Hiring",
        description:
          "Save time and effort by connecting directly with candidates pre-assessed by industry experts.",
      },
    ],
    buttonText: "Get Started",
    link: "/hr-signup",
  },
  {
    title: "How It Works for Candidates",
    image: candidate,
    points: [
      {
        title: "Select Your Skills",
        description:
          "Choose from a variety of IT domains and technologies, such as software development, data science, cloud computing, cybersecurity, and more.",
      },
      {
        title: "Schedule a Mock Interview",
        description:
          "Match with a freelance interviewer who specializes in your desired skill set and schedule your mock interview at a convenient time.",
      },
      {
        title: "Receive Feedback & Ratings",
        description:
          "Get a detailed performance report with strengths, areas for improvement, and actionable suggestions to boost your readiness.",
      },
    ],
    buttonText: "Get Started",
    link: "/candidate-signup",
  },
  {
    title: "How It Works for Freelance Interviewers",
    image: Interviewers,
    points: [
      {
        title: "Share Your Expertise",
        description:
          "Join our platform as an interviewer and leverage your industry experience to guide aspiring candidates.",
      },
      {
        title: "Conduct Mock Interviews",
        description:
          "Engage with candidates in real-world interview scenarios tailored to their technical expertise.",
      },
      {
        title: "Provide Insightful Feedback",
        description:
          "Deliver thorough assessments, rate candidates on their skillset, and help shape the next generation of IT professionals.",
      },
    ],
    buttonText: "Join as Interviewer",
    link: "/interviewer-signup",
  },
];

export const LandingFeature = () => {
  return (
    <section className="relative py-24 bg-gradient-to-r from-blue-50 to-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className={`flex flex-col-reverse sm:flex-row items-center justify-between mb-20 space-y-10 sm:space-y-0 ${
              index % 2 === 0 ? "" : "sm:flex-row-reverse"
            }`}
          >
            <div className="w-full sm:w-1/2 overflow-hidden shadow-xl transform transition-transform duration-500">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-full object-cover shadow-lg"
              />
            </div>
            <div className="w-full sm:w-1/2 sm:pl-12 mt-10 sm:mt-0">
              <h2 className="text-3xl font-semibold text-[#0077B5] mb-6">
                {feature.title}
              </h2>
              <ul className="text-base sm:text-lg text-gray-700 mb-6 list-inside space-y-3">
                {feature.points.map((point, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{point.title}:</span>{" "}
                    {point.description}
                  </li>
                ))}
              </ul>
              <Link
                to={feature.link}
                className="px-8 py-4 bg-[#0077B5] text-white rounded-lg font-semibold transform transition-all duration-300 hover:scale-105 hover:bg-[#005582] shadow-lg"
              >
                {feature.buttonText}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
