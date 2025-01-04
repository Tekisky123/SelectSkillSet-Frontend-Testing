import { Hero } from "./Hero";
import { Features } from "./Features";
import { Statistics } from "./Statistics";
import { Testimonials } from "./Testimonials";
import { CallToAction } from "./CallToAction";
import { LandingFeature } from "./LandingFeature";
import SliderCards from "./SliderCards";

export const HomePage = () => {
  return (
    <div className="bg-[#F3F2EF]">
      <Hero />
      {/*<LandingFeature />*/}
      <SliderCards />
      <Features />
      {/* <Statistics /> */}
      {/* <Testimonials /> */}
      <CallToAction />
    </div>
  );
};
