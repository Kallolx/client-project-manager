import { create } from "zustand";
import type { ProjectFormData, ServiceType, ProjectType, Feature, DesignComplexity } from "./types";

interface FormState {
  currentStep: number;
  formData: Partial<ProjectFormData>;
  uploadedFiles: File[];
  logoFile: File | null;
  referenceLinks: string[];
  isSubmitting: boolean;
  projectCode: string | null;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<ProjectFormData>) => void;
  setServiceType: (type: ServiceType) => void;
  setProjectType: (type: ProjectType) => void;
  toggleFeature: (feature: Feature) => void;
  setDesignComplexity: (complexity: DesignComplexity) => void;
  setPages: (pages: number) => void;
  setResponsive: (responsive: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
  addFiles: (files: File[]) => void;
  setLogoFile: (file: File | null) => void;
  removeFile: (index: number) => void;
  addReferenceLink: (link: string) => void;
  removeReferenceLink: (index: number) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setProjectCode: (code: string) => void;
  reset: () => void;
}

const initialFormData: Partial<ProjectFormData> = {
  service_type: undefined,
  client_name: "",
  email: "",
  whatsapp: "",
  company_name: "",
  country: "",
  project_name: "",
  project_description: "",
  target_audience: "",
  deadline: "",
  brand_colors: "",
  existing_website: "",
  notes: "",
  project_type: undefined,
  features: [],
  pages: 1,
  design_complexity: "moderate",
  responsive: true,
  dark_mode: false,
  references: [],
};

export const useFormStore = create<FormState>((set) => ({
  currentStep: 1,
  formData: { ...initialFormData },
  uploadedFiles: [],
  logoFile: null,
  referenceLinks: [],
  isSubmitting: false,
  projectCode: null,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  setServiceType: (type) =>
    set((state) => ({ formData: { ...state.formData, service_type: type } })),

  setProjectType: (type) =>
    set((state) => ({ formData: { ...state.formData, project_type: type } })),

  toggleFeature: (feature) =>
    set((state) => {
      const currentFeatures = state.formData.features || [];
      const newFeatures = currentFeatures.includes(feature)
        ? currentFeatures.filter((f) => f !== feature)
        : [...currentFeatures, feature];
      return { formData: { ...state.formData, features: newFeatures } };
    }),

  setDesignComplexity: (complexity) =>
    set((state) => ({
      formData: { ...state.formData, design_complexity: complexity },
    })),

  setPages: (pages) =>
    set((state) => ({ formData: { ...state.formData, pages } })),

  setResponsive: (responsive) =>
    set((state) => ({ formData: { ...state.formData, responsive } })),

  setDarkMode: (darkMode) =>
    set((state) => ({ formData: { ...state.formData, dark_mode: darkMode } })),

  addFiles: (files) =>
    set((state) => ({ uploadedFiles: [...state.uploadedFiles, ...files] })),

  setLogoFile: (file) => set({ logoFile: file }),

  removeFile: (index) =>
    set((state) => ({
      uploadedFiles: state.uploadedFiles.filter((_, i) => i !== index),
    })),

  addReferenceLink: (link) =>
    set((state) => ({ referenceLinks: [...state.referenceLinks, link] })),

  removeReferenceLink: (index) =>
    set((state) => ({
      referenceLinks: state.referenceLinks.filter((_, i) => i !== index),
    })),

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setProjectCode: (code) => set({ projectCode: code }),

  reset: () =>
    set({
      currentStep: 1,
      formData: { ...initialFormData },
      uploadedFiles: [],
      logoFile: null,
      referenceLinks: [],
      isSubmitting: false,
      projectCode: null,
    }),
}));
