/**
 * Home Page — Single-page scroll-driven experience.
 * Assembles all home sections in order per the Blueprint Section 5.
 */
import HeroSection from '@/components/home/HeroSection';
import WhatIsPicoSection from '@/components/home/WhatIsPicoSection';
import PersonalitySection from '@/components/home/PersonalitySection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import HardwareSection from '@/components/home/HardwareSection';
import TechStackSection from '@/components/home/TechStackSection';
import GetStartedSection from '@/components/home/GetStartedSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhatIsPicoSection />
      <PersonalitySection />
      <FeaturesSection />
      <HowItWorksSection />
      <HardwareSection />
      <TechStackSection />
      <GetStartedSection />
    </>
  );
}
