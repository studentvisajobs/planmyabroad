import {
  StudyIntent,
  EducationLevel,
  EnglishTestType,
  type UserProfile,
  type CountryRule,
} from "@prisma/client";
import { assessRoutes } from "@/lib/assessment";

export type PathwayResult = {
  country: string;
  pathway: string;
  eligibilityScore: number;
  description: string;
  estimatedCost: string;
  timeline: string;
  settlementPotential: string;
  blockers: string[];
  roadmap: string[];
  scoreBreakdown: {
    education: number;
    workExperience: number;
    language: number;
    finances: number;
    documents: number;
    pathwayFit: number;
  };
};

type BestRoute = "study" | "work" | "migration" | null;

function hasStrongEducation(level: EducationLevel) {
  return [
    EducationLevel.BACHELORS,
    EducationLevel.MASTERS,
    EducationLevel.PHD,
  ].includes(level);
}

function getDocumentCount(profile: UserProfile) {
  const docs = [
    profile.hasPassport,
    profile.hasDegreeCertificate,
    profile.hasTranscript,
    profile.hasCv,
    profile.hasSop,
    profile.hasRecommendationLetter,
    profile.hasEnglishTestResult,
  ];

  return docs.filter(Boolean).length;
}

function getPrimaryFunds(profile: UserProfile) {
  return profile.savingsAmount ?? profile.budget ?? 0;
}

function routeLabel(route: BestRoute, profile: UserProfile, rule: CountryRule) {
  if (route === "study") return "Study Pathway";

  if (route === "work") {
    if (profile.hasJobOffer && rule.requiresJobOffer) {
      return "Employer-Sponsored Work";
    }

    return "Work Pathway";
  }

  if (route === "migration") return "Skilled Migration";

  if (rule.migrationAvailable) return "Skilled Migration";
  if (rule.workAvailable) return "Work Pathway";
  if (rule.studyAvailable) return "Study Pathway";

  return "General Route";
}

function getDescription(rule: CountryRule, pathway: string) {
  if (pathway === "Study Pathway") {
    return `${rule.country} offers study-based routes that can support long-term relocation planning when your documents, funds, and language profile are strong enough.`;
  }

  if (pathway === "Employer-Sponsored Work") {
    return `${rule.country} can be a strong option if you meet the work, language, and employer-based requirements for sponsored employment.`;
  }

  if (pathway === "Work Pathway") {
    return `${rule.country} may be a good fit through a work-based route if your experience, language profile, and employability are strong enough.`;
  }

  if (pathway === "Skilled Migration") {
    return `${rule.country} has migration-focused routes that may reward education, experience, language strength, and overall pathway fit.`;
  }

  return `${rule.country} may still be an option depending on your profile strength and route-specific requirements.`;
}

function getSettlementPotential(rule: CountryRule, pathway: string) {
  if (pathway === "Skilled Migration") return "High";
  if (rule.migrationAvailable) return "High";
  if (pathway === "Study Pathway" && rule.workAvailable) return "Medium to High";
  if (pathway === "Employer-Sponsored Work" || pathway === "Work Pathway") return "Medium";
  if (rule.studyAvailable && rule.workAvailable) return "Medium to High";
  if (rule.workAvailable) return "Medium";
  return "Low to Medium";
}

function getTimeline(rule: CountryRule, pathway: string) {
  if (pathway === "Study Pathway") {
    return rule.processingTimeStudy || "Varies by intake and embassy";
  }

  if (pathway === "Employer-Sponsored Work" || pathway === "Work Pathway") {
    return rule.processingTimeWork || "Varies by employer and route";
  }

  if (pathway === "Skilled Migration") {
    return rule.processingTimeMigration || "Varies by stream";
  }

  return "Varies by route";
}

function getEstimatedCost(rule: CountryRule, pathway: string) {
  if (pathway === "Study Pathway") {
    return rule.estimatedStudyCost || "Varies by institution and city";
  }

  if (pathway === "Employer-Sponsored Work" || pathway === "Work Pathway") {
    return rule.estimatedWorkVisaCost || "Varies by route";
  }

  if (pathway === "Skilled Migration") {
    return rule.estimatedMigrationCost || "Varies by stream";
  }

  return "Varies by route";
}

function scoreEducation(profile: UserProfile, route: BestRoute, rule: CountryRule) {
  if (route === "study") {
    if (hasStrongEducation(profile.educationLevel)) return 18;
    return 12;
  }

  if (route === "migration") {
    if (!rule.requiresDegree) return 14;
    return hasStrongEducation(profile.educationLevel) ? 20 : 8;
  }

  if (!rule.requiresDegree) return 14;
  return hasStrongEducation(profile.educationLevel) ? 18 : 10;
}

function scoreWork(profile: UserProfile, route: BestRoute, rule: CountryRule) {
  if (route === "study") {
    if (profile.workExperience >= 2) return 10;
    return 6;
  }

  if (route === "work") {
    if (profile.workExperience >= 5) return 20;
    if (profile.workExperience >= 3) return 17;
    if (profile.workExperience >= 1) return 12;
    return 5;
  }

  if (route === "migration") {
    if (profile.workExperience >= 5) return 20;
    if (profile.workExperience >= 3) return 16;
    if (profile.workExperience >= 1) return 10;
    return 4;
  }

  if (!rule.requiresWorkExperience) {
    return profile.workExperience >= 1 ? 16 : 12;
  }

  if (profile.workExperience >= 5) return 20;
  if (profile.workExperience >= 3) return 16;
  if (profile.workExperience >= 1) return 10;
  return 4;
}

function scoreLanguage(profile: UserProfile, rule: CountryRule) {
  if (!rule.requiresEnglishTest) return 16;

  if (
    profile.englishTestType === EnglishTestType.NONE ||
    !profile.englishScore
  ) {
    return 3;
  }

  if (rule.minEnglishScore == null) return 14;
  if (profile.englishScore >= rule.minEnglishScore + 1) return 20;
  if (profile.englishScore >= rule.minEnglishScore) return 16;
  if (profile.englishScore >= rule.minEnglishScore - 0.5) return 10;
  return 4;
}

function scoreFinances(profile: UserProfile, route: BestRoute, rule: CountryRule) {
  const funds = getPrimaryFunds(profile);

  if (route === "study") {
    if (funds >= 20000) return 20;
    if (funds >= 12000) return 16;
    if (funds >= 8000) return 12;
    if (funds > 0) return 6;
    return 2;
  }

  if (!rule.requiresFundsProof) {
    return funds > 0 ? 16 : 12;
  }

  if (funds >= 20000) return 20;
  if (funds >= 12000) return 15;
  if (funds >= 6000) return 10;
  if (funds > 0) return 5;
  return 2;
}

function scoreDocuments(profile: UserProfile) {
  const count = getDocumentCount(profile);
  if (count >= 6) return 10;
  if (count >= 4) return 7;
  if (count >= 2) return 4;
  return 1;
}

function scorePathwayFit(
  profile: UserProfile,
  rule: CountryRule,
  route: BestRoute
) {
  let score = 0;

  if (route === "study") {
    if (profile.studyIntent !== StudyIntent.NONE) score += 6;
    else score -= 2;
  }

  if (route === "work") {
    if (profile.hasJobOffer) score += 5;
    if (profile.workExperience >= 2) score += 3;
  }

  if (route === "migration") {
    if (profile.workExperience >= 3) score += 4;
    if (hasStrongEducation(profile.educationLevel)) score += 3;
    if (
      profile.englishTestType !== EnglishTestType.NONE &&
      profile.englishScore
    ) {
      score += 2;
    }
  }

  if (profile.preferredCountries.includes(rule.country)) {
    score += 2;
  }

  return Math.max(0, Math.min(score, 10));
}

function buildBlockers(
  profile: UserProfile,
  rule: CountryRule,
  pathway: string,
  bestReasons: string[]
) {
  const blockers = [...bestReasons];

  if (rule.requiresDegree && !hasStrongEducation(profile.educationLevel)) {
    blockers.push("Your education level may be too weak for this route.");
  }

  if (
    (pathway === "Employer-Sponsored Work" || pathway === "Work Pathway") &&
    profile.workExperience < 2
  ) {
    blockers.push("You may need stronger work experience for this work route.");
  }

  if (pathway === "Skilled Migration" && profile.workExperience < 3) {
    blockers.push("You may need stronger work experience for migration.");
  }

  if (rule.requiresJobOffer && !profile.hasJobOffer) {
    blockers.push("A valid job offer may be required for this route.");
  }

  if (
    rule.requiresEnglishTest &&
    (profile.englishTestType === EnglishTestType.NONE || !profile.englishScore)
  ) {
    blockers.push("You may need an approved English test result.");
  } else if (
    rule.requiresEnglishTest &&
    rule.minEnglishScore != null &&
    profile.englishScore != null &&
    profile.englishScore < rule.minEnglishScore
  ) {
    blockers.push("Your English score may be below the likely minimum for this route.");
  }

  if (rule.requiresFundsProof && getPrimaryFunds(profile) < 6000) {
    blockers.push("You may need stronger proof of funds.");
  }

  if (!profile.hasPassport) {
    blockers.push("You need a valid passport before applying.");
  }

  if (!profile.hasCv && pathway !== "Study Pathway") {
    blockers.push("Your CV is missing and may be needed for applications.");
  }

  if (pathway === "Study Pathway" && !profile.hasTranscript) {
    blockers.push("Your academic transcript may be required.");
  }

  if (pathway === "Study Pathway" && !profile.hasRecommendationLetter) {
    blockers.push("A recommendation letter may strengthen or support this route.");
  }

  return Array.from(new Set(blockers)).slice(0, 6);
}

function buildRoadmap(
  profile: UserProfile,
  rule: CountryRule,
  blockers: string[],
  pathway: string
) {
  const roadmap: string[] = [];

  roadmap.push(
    `Confirm ${pathway.toLowerCase()} requirements for ${rule.country} and focus on this as your current best route.`
  );

  if (pathway === "Study Pathway") {
    roadmap.push(
      `Prepare academic documents for study applications, especially your certificate, transcript, and statement materials.`
    );
  }

  if (pathway === "Employer-Sponsored Work" || pathway === "Work Pathway") {
    roadmap.push(
      `Strengthen your CV, target employers, and prepare for job applications aligned with your occupation.`
    );
  }

  if (pathway === "Skilled Migration") {
    roadmap.push(
      `Strengthen the core migration factors: education, work history, language score, and proof of funds.`
    );
  }

  roadmap.push(
    `Collect the core documents commonly needed for ${rule.country}, including: ${rule.keyDocuments.slice(0, 4).join(", ")}.`
  );

  if (rule.requiresEnglishTest) {
    roadmap.push(
      `Prepare for an accepted English test (${rule.acceptedEnglishTests.join(", ")}) and aim to meet or exceed the likely minimum score.`
    );
  }

  if (rule.requiresFundsProof) {
    roadmap.push(
      `Build your financial evidence so you can meet proof-of-funds expectations for ${rule.country}.`
    );
  }

  if (rule.requiresJobOffer) {
    roadmap.push(
      `Focus on employer outreach and job applications, because this route often depends on a valid job offer.`
    );
  }

  if (blockers.length > 0) {
    roadmap.push(
      `Address your biggest blockers first: ${blockers.slice(0, 2).join(" ")}`
    );
  }

  return roadmap.slice(0, 6);
}

export function buildPathwayResult(
  profile: UserProfile,
  rule: CountryRule
): PathwayResult {
  const assessment = assessRoutes(profile, rule);
  const best = assessment.best;
  const bestRoute: BestRoute = best?.route ?? null;
  const pathway = routeLabel(bestRoute, profile, rule);

  const scoreBreakdown = {
    education: scoreEducation(profile, bestRoute, rule),
    workExperience: scoreWork(profile, bestRoute, rule),
    language: scoreLanguage(profile, rule),
    finances: scoreFinances(profile, bestRoute, rule),
    documents: scoreDocuments(profile),
    pathwayFit: scorePathwayFit(profile, rule, bestRoute),
  };

  const calculatedScore =
    scoreBreakdown.education +
    scoreBreakdown.workExperience +
    scoreBreakdown.language +
    scoreBreakdown.finances +
    scoreBreakdown.documents +
    scoreBreakdown.pathwayFit;

  const eligibilityScore =
    best?.score != null ? best.score : Math.min(100, calculatedScore);

  const blockers = buildBlockers(profile, rule, pathway, best?.reasons ?? []);
  const roadmap = buildRoadmap(profile, rule, blockers, pathway);

  return {
    country: rule.country,
    pathway,
    eligibilityScore,
    description: getDescription(rule, pathway),
    estimatedCost: getEstimatedCost(rule, pathway),
    timeline: getTimeline(rule, pathway),
    settlementPotential: getSettlementPotential(rule, pathway),
    blockers,
    roadmap,
    scoreBreakdown,
  };
}