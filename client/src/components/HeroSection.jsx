import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import AuthDialog from "./AuthDialog";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCandidateAuthOpen, setIsCandidateAuthOpen] = useState(false);
  const [currentText, setCurrentText] = useState(0);

  const rotatingTexts = [
    "Dream Job",
    "Perfect Career",
    "Next Opportunity",
    "Ideal Position"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  const handleFindJobClick = () => {
    if (user) {
      navigate("/jobs");
    } else {
      setIsCandidateAuthOpen(true);
    }
  };

  const handlePostJobClick = () => {
    if (user && user.role === "recruiter") {
      navigate("/recruiter/post-job");
    } else {
      setIsCandidateAuthOpen(true);
    }
  };

  return (
    <section className="relative bg-background min-h-[600px] flex flex-col items-center justify-center text-center px-8 py-24">
      {/* Simple Background Animation */}
      <div className="absolute inset-0 overflow-hidden opacity-5 dark:opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Main Heading with Text Effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-foreground leading-tight">
            Find Your{" "}
            <motion.span
              key={currentText}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
            >
              {rotatingTexts[currentText]}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed"
          >
            Explore thousands of job listings or find the perfect candidate with our AI-powered platform
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {!user ? (
            // Show both buttons for non-logged-in users
            <>
              <Button
                onClick={handleFindJobClick}
                size="lg"
                className="px-8 py-3 text-lg hover:scale-105 transition-transform duration-200"
              >
                Find Jobs
              </Button>
              <Button
                onClick={handlePostJobClick}
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg hover:scale-105 transition-transform duration-200"
              >
                Post a Job
              </Button>
            </>
          ) : user.role === "candidate" ? (
            // Show only Find Jobs button for candidates
            <Button
              onClick={handleFindJobClick}
              size="lg"
              className="px-8 py-3 text-lg hover:scale-105 transition-transform duration-200"
            >
              Find Jobs
            </Button>
          ) : user.role === "recruiter" ? (
            // Show only Post Job button for recruiters
            <Button
              onClick={handlePostJobClick}
              size="lg"
              className="px-8 py-3 text-lg hover:scale-105 transition-transform duration-200"
            >
              Post a Job
            </Button>
          ) : null}
        </motion.div>
      </div>

      <AuthDialog open={isCandidateAuthOpen} onOpenChange={setIsCandidateAuthOpen} />
    </section>
  );
};

export default HeroSection;
