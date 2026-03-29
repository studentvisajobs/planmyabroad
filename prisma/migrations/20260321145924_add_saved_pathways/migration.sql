-- CreateTable
CREATE TABLE "SavedPathway" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "pathway" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedPathway_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavedPathway" ADD CONSTRAINT "SavedPathway_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
