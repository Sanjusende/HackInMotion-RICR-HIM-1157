import React from 'react';
import { motion } from 'framer-motion';

const Timeline = ({ steps }) => {
  return (
    <div className="relative border-l border-primary/30 ml-4 md:ml-6 space-y-8 py-4">
      {steps.map((step, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="relative pl-8 md:pl-10 text-left"
        >
          {/* Timeline Node */}
          <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-primary text-white border-4 border-bg-custom flex items-center justify-center font-bold shadow-small text-sm shrink-0">
            {step.number || idx + 1}
          </div>

          {/* Timeline Content */}
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-dark-text">{step.title}</h4>
            <p className="text-secondary-text text-sm font-semibold leading-relaxed">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline;
