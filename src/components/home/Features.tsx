import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Users, Award, Building2, Briefcase, Globe, Star } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "For Candidates",
    description:
      "Access top-rated interviewers, schedule mock interviews, and enhance your job readiness with personalized guidance.",
    color: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    icon: Award,
    title: "For Interviewers",
    description:
      "Share your expertise, build your reputation, and earn rewards by conducting professional interviews.",
    color: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: Building2,
    title: "For Corporates",
    description:
      "Simplify your hiring process with data-driven insights, real-time feedback, and expert evaluations.",
    color: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    icon: Briefcase,
    title: "Career Growth",
    description:
      "Unlock career opportunities with tailored resources, curated job listings, and expert advice.",
    color: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Connect with professionals, candidates, and interviewers from across the globe, anytime, anywhere.",
    color: "bg-indigo-50",
    iconColor: "text-indigo-500",
  },
  {
    icon: Star,
    title: "Trusted Platform",
    description:
      "Join thousands of users who trust us for transparent, efficient, and impactful hiring solutions.",
    color: "bg-red-50",
    iconColor: "text-red-500",
  },
];

const FeatureCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  iconColor: string;
  index: number;
}> = ({ icon: Icon, title, description, color, iconColor, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`${color} p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105`}
    >
      <div className={`${iconColor} mb-4`}>
        <Icon size={36} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Why Choose Us?
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Explore how our platform empowers candidates, interviewers, and
            corporates to achieve success.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
