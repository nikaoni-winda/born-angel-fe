import React, { useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/common/Hero';
import ServicesSection from '../../components/common/ServicesSection';
import CategorySection from '../../components/common/CategorySection';
import ReviewSection from '../../components/common/ReviewSection';
import AestheticCTA from '../../components/common/AestheticCTA';
import Footer from '../../components/layout/Footer';

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      <ServicesSection />
      <CategorySection />
      <ReviewSection />
      <AestheticCTA />
      <Footer />
    </div>
  );
};

export default HomePage;
