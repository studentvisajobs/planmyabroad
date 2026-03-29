/*
  Warnings:

  - The `englishTestType` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED');

-- CreateEnum
CREATE TYPE "EnglishTestType" AS ENUM ('IELTS', 'TOEFL', 'PTE', 'NONE');

-- CreateEnum
CREATE TYPE "StudyIntent" AS ENUM ('UNDERGRADUATE', 'POSTGRADUATE', 'NONE');

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "annualSalary" DOUBLE PRECISION,
ADD COLUMN     "criminalRecord" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasCv" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasDegreeCertificate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasEnglishTestResult" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasJobOffer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasPassport" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasRecommendationLetter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasScholarshipInterest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasSop" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasTranscript" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jobOfferCountry" TEXT,
ADD COLUMN     "maritalStatus" "MaritalStatus" NOT NULL DEFAULT 'SINGLE',
ADD COLUMN     "preferredIntake" TEXT,
ADD COLUMN     "previousVisaRefusal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "relocationTimelineMonths" INTEGER,
ADD COLUMN     "savingsAmount" DOUBLE PRECISION,
ADD COLUMN     "spouseEnglishScore" DOUBLE PRECISION,
ADD COLUMN     "spouseHasEnglish" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "studyIntent" "StudyIntent" NOT NULL DEFAULT 'NONE',
DROP COLUMN "englishTestType",
ADD COLUMN     "englishTestType" "EnglishTestType" NOT NULL DEFAULT 'NONE';
