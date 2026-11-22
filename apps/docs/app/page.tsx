/**
 * 首页：首屏、色彩、设计取向三节。
 */
import { CommitmentsSection } from "@/home/commitments-section";
import { HeroSection } from "@/home/hero-section";
import { PaletteSection } from "@/home/palette-section";

const HomePage = () => (
  <div className="mx-auto max-w-[1400px] px-5 md:px-8">
    <HeroSection />
    <PaletteSection />
    <CommitmentsSection />
  </div>
);

export default HomePage;
