import React from 'react'
import HeroSection from './hero-section';
import PromoSection from './promo-section';
import PackagesSection from './packages-section';
import FeaturesSection from './features-section';
import CTASection from './cta-section';


// Componente para las características


const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Promo Section */}
      <PromoSection />

      {/* Packages Section */}
      <PackagesSection />

      {/* Features Table Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection />
      
    </div>
  )
}

export default LandingPage;