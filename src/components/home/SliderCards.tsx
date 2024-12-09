import { motion } from "framer-motion";
import Slider from 'react-slick';

const SliderCards = () => {
  // Updated data for cards with professional and modern content
  const cardsData = [
    {
      title: "Advanced Career Development",
      description:
        "Access tailored resources to elevate your professional growth, from expert-led workshops to curated mentorship programs.",
      imageUrl:
        "https://static.vecteezy.com/system/resources/previews/018/994/407/non_2x/personal-development-or-career-advancement-confident-smart-entrepreneur-runs-fast-on-career-ladder-to-success-free-vector.jpg", // Professional career development image
    },
    {
      title: "Networking & Collaboration",
      description:
        "Connect with industry leaders and peers to foster relationships that accelerate both personal and organizational success.",
      imageUrl:
        "https://representcomms.com/wp-content/uploads/2021/06/black-collaboration-cooperation-943630-1024x684.jpg", // Networking image
    },
    {
      title: "Innovation & Technology",
      description:
        "Stay ahead of the curve by integrating cutting-edge technologies into your business strategies and workflows.",
      imageUrl:
        "https://cybermedia.co.in/wp-content/uploads/2017/06/technology-innovation-870x490.jpg", // Innovation and technology image
    },
    {
      title: "Workplace Wellness",
      description:
        "Improve productivity and employee satisfaction with wellness programs that promote a healthy work-life balance.",
      imageUrl:
        "https://www.dayforce.com/getmedia/cc065324-cfa8-46f6-9f72-f85a5117947e/Why-workplace-wellness-is-important_Hero.png", // Wellness image
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 3, // Show 3 cards at a time
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // For tablets
        settings: {
          slidesToShow: 2, // 2 cards on medium screens
        },
      },
      {
        breakpoint: 640, // For mobile
        settings: {
          slidesToShow: 1, // 1 card on mobile
        },
      },
    ],
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-16">
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl font-bold text-blue-600 text-center mb-16"
        >
          Elevate Your Business with Our Solutions
        </motion.h2>

        {/* Slider Component */}
        <Slider {...settings}>
          {cardsData.map((card, index) => (
            <div key={index} className="p-4">
              <motion.div
                transition={{ duration: 0.8 }}
                className="rounded-xl shadow-lg overflow-hidden transform transition-transform duration-500 hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-56 object-cover rounded-t-xl" // Adjusted the height for smaller cards
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40 rounded-t-xl"></div>
                </div>
                <div className="p-4 bg-white"> {/* Reduced padding for a more compact layout */}
                  <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default SliderCards;
