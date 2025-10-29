import React from "react";
import companies from "../data/companies.json";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { motion } from "framer-motion";

const CompanyCarousel = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-muted/40 to-background dark:from-muted/20 dark:to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Leading Companies
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who found their dream jobs
          </p>
        </motion.div>

        <Carousel
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
          opts={{
            loop: true,
            align: "center",
          }}
        >
          <CarouselContent className="flex gap-8 items-center py-8">
            {companies.map(({ id, name, path }) => (
              <CarouselItem key={id} className="flex items-center justify-center basis-1/2 md:basis-1/3 lg:basis-1/6">
                <motion.div
                  whileHover={{ scale: 1.05, y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group cursor-pointer relative"
                >
                  <div className="bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-border/50 group-hover:border-primary/50 group-hover:bg-accent/20 dark:group-hover:bg-accent/10">
                    <img
                      src={path}
                      alt={`${name} logo`}
                      className={`h-16 w-24 object-contain mx-auto transition-all duration-300 group-hover:scale-110 ${name === 'uber' || name === 'netflix' || name === 'meta'
                        ? 'dark:invert dark:brightness-90'
                        : 'dark:brightness-110 dark:contrast-90'
                        }`}
                      draggable="false"
                      style={{
                        filter: 'opacity(0.85) saturate(0.8)',
                        transition: 'filter 300ms ease-in-out, brightness 300ms ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.filter = 'opacity(1) saturate(1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.filter = 'opacity(0.85) saturate(0.8)';
                      }}
                    />
                  </div>
                  {/* Company name on hover - positioned outside */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    <span className="text-sm font-medium text-foreground capitalize bg-background/95 dark:bg-card/95 backdrop-blur-sm px-3 py-1 rounded-full border border-border shadow-lg">
                      {name}
                    </span>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default CompanyCarousel;
