-- CreateTable
CREATE TABLE "CountryRule" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "studyAvailable" BOOLEAN NOT NULL DEFAULT false,
    "workAvailable" BOOLEAN NOT NULL DEFAULT false,
    "migrationAvailable" BOOLEAN NOT NULL DEFAULT false,
    "minAge" INTEGER,
    "maxAge" INTEGER,
    "requiresDegree" BOOLEAN NOT NULL DEFAULT false,
    "requiresWorkExperience" BOOLEAN NOT NULL DEFAULT false,
    "requiresJobOffer" BOOLEAN NOT NULL DEFAULT false,
    "requiresEnglishTest" BOOLEAN NOT NULL DEFAULT false,
    "requiresFundsProof" BOOLEAN NOT NULL DEFAULT false,
    "acceptedEnglishTests" TEXT[],
    "minEnglishScore" DOUBLE PRECISION,
    "estimatedStudyCost" TEXT,
    "estimatedWorkVisaCost" TEXT,
    "estimatedMigrationCost" TEXT,
    "fundsProofAmount" TEXT,
    "processingTimeStudy" TEXT,
    "processingTimeWork" TEXT,
    "processingTimeMigration" TEXT,
    "keyDocuments" TEXT[],
    "commonRefusalReasons" TEXT[],
    "notes" TEXT,
    "officialSourceUrl" TEXT,
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountryRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CountryRule_country_key" ON "CountryRule"("country");
