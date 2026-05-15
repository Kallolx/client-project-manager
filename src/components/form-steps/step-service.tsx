"use client";

import { motion } from "framer-motion";
import { useFormStore } from "@/lib/store";
import { SERVICE_TYPES } from "@/lib/constants";
import type { ServiceType } from "@/lib/types";

export function StepService() {
  const { formData, setServiceType, nextStep } = useFormStore();

  const handleSelect = (type: ServiceType) => {
    setServiceType(type);
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          What do you need?
        </h2>
        <p className="text-muted-foreground">
          Select the type of service you&apos;re looking for
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SERVICE_TYPES.map((service, index) => {
          const isSelected = formData.service_type === service.value;

          return (
            <motion.button
              key={service.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelect(service.value)}
              className={`group relative p-4 rounded-xl border text-left transition-all duration-200
                ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/5"
                    : "border-border hover:border-primary/50 bg-card hover:bg-accent/50"
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">
                    {service.label}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {service.description}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors mt-0.5
                    ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-border group-hover:border-primary/50"
                    }
                  `}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-white"
                    />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
