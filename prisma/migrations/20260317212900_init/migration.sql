-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('HIGH_SCHOOL', 'DIPLOMA', 'BACHELORS', 'MASTERS', 'PHD');

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "currentCountry" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "educationLevel" "EducationLevel" NOT NULL,
    "fieldOfStudy" TEXT,
    "gpa" DOUBLE PRECISION,
    "workExperience" INTEGER NOT NULL DEFAULT 0,
    "occupation" TEXT,
    "englishTestType" TEXT,
    "englishScore" DOUBLE PRECISION,
    "budget" DOUBLE PRECISION,
    "preferredCountries" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);
