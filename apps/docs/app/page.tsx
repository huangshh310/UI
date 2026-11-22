/**
 * 首页：首屏、精选示例、色彩、设计取向四节。
 */
import { CommitmentsSection } from "@/home/commitments-section";
import { FeaturedSection } from "@/home/featured-section";
import { HeroSection } from "@/home/hero-section";
import { PaletteSection } from "@/home/palette-section";

const HomePage = () => (
  <div className="mx-auto max-w-[1400px] px-5 md:px-9">
    <HeroSection />
    <FeaturedSection />
    <PaletteSection />
    <CommitmentsSection />
  </div>
);

export default HomePage;
