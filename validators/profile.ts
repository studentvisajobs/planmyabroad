import { z } from "zod";

export const educationLevels = [
  "HIGH_SCHOOL",
  "DIPLOMA",
  "BACHELORS",
  "MASTERS",
  "PHD",
] as const;

export const englishTestTypes = ["IELTS", "TOEFL", "PTE", "NONE"] as const;

export const maritalStatuses = ["SINGLE", "MARRIED"] as const;

export const studyIntents = [
  "UNDERGRADUATE",
  "POSTGRADUATE",
  "NONE",
] as const;

export const profileSchema = z.object({
  nationality: z.string().min(2, "Nationality is required"),
  currentCountry: z.string().min(2, "Current country is required"),
  age: z.coerce.number().int().min(16).max(80),
  educationLevel: z.enum(educationLevels),
  fieldOfStudy: z.string().optional(),
  gpa: z.coerce.number().min(0).max(5).optional(),
  workExperience: z.coerce.number().int().min(0).max(50),
  occupation: z.string().optional(),

  englishTestType: z.enum(englishTestTypes).default("NONE"),
  englishScore: z.coerce.number().min(0).max(9).optional(),

  budget: z.coerce.number().min(0).optional(),
  preferredCountries: z.array(z.string()).default([]),

  maritalStatus: z.enum(maritalStatuses).default("SINGLE"),
  hasPassport: z.boolean().default(false),
  hasDegreeCertificate: z.boolean().default(false),
  hasTranscript: z.boolean().default(false),
  hasCv: z.boolean().default(false),
  hasSop: z.boolean().default(false),
  hasRecommendationLetter: z.boolean().default(false),
  hasEnglishTestResult: z.boolean().default(false),

  studyIntent: z.enum(studyIntents).default("NONE"),
  preferredIntake: z.string().optional(),
  savingsAmount: z.coerce.number().min(0).optional(),
  hasScholarshipInterest: z.boolean().default(false),

  hasJobOffer: z.boolean().default(false),
  jobOfferCountry: z.string().optional(),
  annualSalary: z.coerce.number().min(0).optional(),

  spouseHasEnglish: z.boolean().default(false),
  spouseEnglishScore: z.coerce.number().min(0).max(9).optional(),

  previousVisaRefusal: z.boolean().default(false),
  criminalRecord: z.boolean().default(false),

  relocationTimelineMonths: z.coerce.number().int().min(1).max(60).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;