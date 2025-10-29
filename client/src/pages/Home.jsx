import React, { useEffect } from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";
import ForSection from "../components/ForSection";
import FAQSection from "../components/FAQSection";
import CTASection from "../components/CTASection";
import CompanyCarousel from "../components/CompanyCarousel";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/recruiter", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        id="hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <HeroSection />
      </motion.section>

      {/* Company Carousel */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <CompanyCarousel />
      </motion.section>

      {/* For Section */}
      <motion.section
        id="for-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <ForSection />
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        id="faq-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <FAQSection />
      </motion.section>

      {/* CTA Section */}
      <motion.section
        id="cta-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <CTASection />
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;