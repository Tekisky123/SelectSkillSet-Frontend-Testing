import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    text: "The platform helped me prepare for technical interviews effectively. The interviewers were experienced and provided valuable feedback.",
  },
  {
    name: "Michael Chen",
    role: "Senior Interviewer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    text: "Being an interviewer on this platform has been rewarding. I get to help candidates while sharing my industry experience.",
  },
  {
    name: "Emily Rodriguez",
    role: "HR Director",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    text: "The quality of candidates we have found through this platform has been exceptional. The rating system helps us make informed decisions.",
  },
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#F3F2EF] to-[#E5E5E5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12 text-gray-800"
        >
          What Our Users Say
        </motion.h2>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
            >
              <div className="flex flex-col items-center text-center">
                <motion.img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-24 h-24 rounded-full mb-6 object-cover border-4 border-[#0077B5]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <p className="text-lg text-gray-600 italic leading-relaxed mb-6">
                  "{testimonials[currentIndex].text}"
                </p>
                <h3 className="font-semibold text-xl text-gray-800">
                  {testimonials[currentIndex].name}
                </h3>
                <p className="text-[#0077B5] font-medium">{testimonials[currentIndex].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="hidden"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="hidden"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};
