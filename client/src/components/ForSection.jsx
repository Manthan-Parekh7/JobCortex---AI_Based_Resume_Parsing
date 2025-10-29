import React from "react";
import { motion } from "framer-motion";
import { Search, Building2, Users, TrendingUp, CheckCircle, Clock } from "lucide-react";

const ForSection = () => {
  const features = {
    jobSeekers: [
      { icon: Search, text: "Smart job matching with AI" },
      { icon: Clock, text: "Real-time application tracking" },
      { icon: CheckCircle, text: "Resume optimization tools" }
    ],
    employers: [
      { icon: Users, text: "Access to top talent pool" },
      { icon: TrendingUp, text: "Advanced candidate screening" },
      { icon: Building2, text: "Company branding tools" }
    ]
  };

  return (
    <section className="max-w-7xl mx-auto my-20 px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Built for Everyone
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Whether you're searching for your next opportunity or looking to hire top talent,
          we've got you covered with powerful tools and insights.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Job Seekers Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="group"
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-200/50 dark:border-blue-700/50 group-hover:border-blue-300/70 dark:group-hover:border-blue-600/70 h-full">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-600 rounded-xl text-white mr-4 group-hover:scale-110 transition-transform duration-300">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">For Job Seekers</h3>
            </div>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Discover opportunities that match your skills and aspirations. Our AI-powered platform
              helps you find the perfect role and stand out to employers.
            </p>
            <div className="space-y-4">
              {features.jobSeekers.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center"
                >
                  <feature.icon className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="text-foreground">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Employers Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="group"
        >
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50 group-hover:border-purple-300/70 dark:group-hover:border-purple-600/70 h-full">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-600 rounded-xl text-white mr-4 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">For Employers</h3>
            </div>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Find exceptional talent efficiently. Our platform streamlines recruitment with
              advanced tools to identify and attract the best candidates for your team.
            </p>
            <div className="space-y-4">
              {features.employers.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center"
                >
                  <feature.icon className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0" />
                  <span className="text-foreground">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ForSection;
