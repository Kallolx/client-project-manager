"use client";

import { AnimatePresence } from "framer-motion";
import { useFormStore } from "@/lib/store";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { StepIndicator } from "@/components/step-indicator";
import { StepService } from "@/components/form-steps/step-service";
import { StepClientDetails } from "@/components/form-steps/step-client-details";
import { StepProjectDetails } from "@/components/form-steps/step-project-details";
import { StepFeatures } from "@/components/form-steps/step-features";
import { StepFiles } from "@/components/form-steps/step-files";
import { StepReview } from "@/components/form-steps/step-review";

export default function StartProjectPage() {
  const { currentStep, projectCode } = useFormStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepService />;
      case 2:
        return <StepClientDetails />;
      case 3:
        return <StepProjectDetails />;
      case 4:
        return <StepFeatures />;
      case 5:
        return <StepFiles />;
      case 6:
        return <StepReview />;
      default:
        return <StepService />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {!projectCode && <StepIndicator currentStep={currentStep} />}
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
