"use client";

import { motion } from "framer-motion";
import { FORM_STEPS } from "@/lib/constants";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Mobile: simple text */}
      <div className="sm:hidden flex items-center justify-between mb-6 px-1">
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {FORM_STEPS.length}
        </span>
        <span className="text-sm font-medium text-foreground">
          {FORM_STEPS[currentStep - 1]?.title}
        </span>
      </div>

      {/* Desktop: full step indicator */}
      <div className="hidden sm:flex items-center justify-between mb-10 relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-border/50" />
        {/* Progress line */}
        <motion.div
          className="absolute top-5 left-0 h-[2px] bg-primary"
          initial={{ width: "0%" }}
          animate={{
            width: `${((currentStep - 1) / (FORM_STEPS.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {FORM_STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? "oklch(0.65 0.15 250)"
                    : isActive
                    ? "oklch(0.22 0.04 250)"
                    : "oklch(0.16 0.025 250)",
                  borderColor: isCompleted || isActive
                    ? "oklch(0.65 0.15 250)"
                    : "oklch(0.30 0.04 250)",
                }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2"
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.id}
                  </span>
                )}
              </motion.div>
              <span
                className={`text-xs font-medium ${
                  isActive
                    ? "text-foreground"
                    : isCompleted
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
