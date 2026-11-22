/**
 * 首页：居中的首屏，以及示例卡片网格。
 */
import { FeaturedSection } from "@/home/featured-section";
import { HeroSection } from "@/home/hero-section";

const HomePage = () => (
  <div className="mx-auto max-w-[1400px] px-5 md:px-9">
    <HeroSection />
    <FeaturedSection />
  </div>
);

export default HomePage;
