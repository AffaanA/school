import React from "react";
import HeroSection from "./HeroSection";
import Navbar from "../../components/Navbar/Navbar";
import Features from "./Features/Features";
import ServiceSection from "./Services/ServicesSection";
import SeeMore from "./SeeMore/SeeMore";
import Management from "./Managment/Management";
import TrustSection from "./Trust/TrustSection";
import Footer from "../../components/Footer/Footer";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Features />
      <ServiceSection />
      <SeeMore />
      <Management />
      <TrustSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
