import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "What is JobCortex?",
    answer:
      "JobCortex is an AI-powered job portal that connects job seekers with top employers efficiently and effectively. Our platform uses advanced algorithms to match candidates with their ideal opportunities.",
  },
  {
    question: "How do I post a job?",
    answer:
      "Employers can post jobs by creating a recruiter account and navigating to the 'Post a Job' section in their dashboard. Our intuitive interface makes it easy to create compelling job listings.",
  },
  {
    question: "How can I search for jobs?",
    answer:
      "Use the advanced search bar on the jobs page to filter opportunities by title, location, salary range, and categories that match your skills and preferences.",
  },
  {
    question: "How do I apply for a job?",
    answer:
      "Click 'View Details' on any job posting and use the 'Apply' button to submit your application with your resume. You can track all applications in your dashboard.",
  },
  {
    question: "Can I save jobs to apply later?",
    answer:
      "Yes! You can bookmark jobs to your profile to review and apply at a convenient time. Access your saved jobs from your dashboard anytime.",
  },
  {
    question: "How do I track my job applications?",
    answer:
      "Monitor all your applications in real-time through the 'My Applications' section in your dashboard. Get updates on application status and interview invitations.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-6xl mx-auto my-20 px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white mr-4">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Got questions? We've got answers. Find everything you need to know about using JobCortex.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {faqData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <div
              className="border border-border rounded-2xl bg-card/50 backdrop-blur-sm p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/30 group-hover:bg-accent/5"
              onClick={() => toggleIndex(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toggleIndex(index);
              }}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
              aria-labelledby={`faq-question-${index}`}
            >
              <div className="flex justify-between items-start">
                <h3
                  id={`faq-question-${index}`}
                  className="font-semibold text-foreground text-lg leading-relaxed pr-4"
                >
                  {item.question}
                </h3>
                <ChevronDown
                  className={`w-6 h-6 text-muted-foreground transition-all duration-300 flex-shrink-0 mt-1 group-hover:text-primary ${openIndex === index ? "rotate-180 text-primary" : ""
                    }`}
                />
              </div>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p
                  id={`faq-answer-${index}`}
                  className="mt-4 text-muted-foreground leading-relaxed border-t border-border/50 pt-4"
                >
                  {item.answer}
                </p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
