type RoadmapStep = {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  estimatedTime: string;
  documents: string[];
};

type RoadmapResult = {
  country: string;
  pathway: string;
  readinessScore: number;
  estimatedTimeline: string;
  blockers: string[];
  nextBestActions: string[];
  steps: RoadmapStep[];
};

function routeLabel(route: string | null, hasJobOffer?: boolean, requiresJobOffer?: boolean) {
  if (route === "study") return "Study Pathway";
  if (route === "work") {
    if (hasJobOffer && requiresJobOffer) return "Employer-Sponsored Work";
    return "Work Pathway";
  }
  if (route === "migration") return "Skilled Migration";
  return "General Route";
}

function getEstimatedTimeline(rule: any, route: string | null) {
  if (route === "study") return rule.processingTimeStudy || "3 to 8 months";
  if (route === "work") return rule.processingTimeWork || "2 to 6 months";
  if (route === "migration") return rule.processingTimeMigration || "6 to 18 months";
  return "Varies by route";
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function generateRoadmap(profile: any, rule: any, assessment: any): RoadmapResult {
  const best = assessment?.best ?? null;
  const route = best?.route ?? null;
  const pathway = routeLabel(route, profile?.hasJobOffer, rule?.requiresJobOffer);
  const readinessScore = best?.score ?? 0;
  const blockers = uniqueStrings(best?.reasons ?? []);
  const keyDocuments: string[] = Array.isArray(rule?.keyDocuments) ? rule.keyDocuments : [];

  const steps: RoadmapStep[] = [];

  steps.push({
    title: `Confirm your ${pathway.toLowerCase()} target`,
    description: `Based on your profile, ${pathway} is currently your strongest route for ${rule.country}. Confirm this route before spending money on the wrong process.`,
    priority: "High",
    estimatedTime: "1 to 3 days",
    documents: [],
  });

  if (!profile?.hasPassport) {
    steps.push({
      title: "Get a valid passport",
      description: "A valid passport is required before you can progress with most migration, study, or work processes.",
      priority: "High",
      estimatedTime: "1 to 6 weeks",
      documents: ["Passport"],
    });
  }

  if (route === "study") {
    steps.push({
      title: "Prepare academic documents",
      description: "Get your degree certificate, transcript, and study documents ready for admission and visa processing.",
      priority: "High",
      estimatedTime: "1 to 3 weeks",
      documents: uniqueStrings([
        "Degree Certificate",
        "Academic Transcript",
        "CV",
        "Statement of Purpose",
        ...keyDocuments.slice(0, 3),
      ]),
    });

    if (rule?.requiresEnglishTest) {
      steps.push({
        title: "Take an accepted English test",
        description: `Prepare for ${Array.isArray(rule?.acceptedEnglishTests) ? rule.acceptedEnglishTests.join(", ") : "an accepted English test"} and aim to meet or exceed the likely minimum score.`,
        priority: "High",
        estimatedTime: "2 to 8 weeks",
        documents: ["English Test Result"],
      });
    }

    if (rule?.requiresFundsProof) {
      steps.push({
        title: "Build proof of funds",
        description: "Prepare bank statements or other acceptable funding evidence for tuition and living costs.",
        priority: "High",
        estimatedTime: "2 to 6 weeks",
        documents: ["Bank Statements", "Funding Evidence"],
      });
    }

    steps.push({
      title: "Apply for admission",
      description: `Target institutions or programs in ${rule.country} that align with your profile and budget.`,
      priority: "Medium",
      estimatedTime: "2 to 8 weeks",
      documents: uniqueStrings([
        "Application Forms",
        "Passport",
        "Academic Documents",
        "SOP",
      ]),
    });

    steps.push({
      title: "Prepare visa application",
      description: "Once admission is secured, assemble your visa file carefully with documents, finances, and language evidence.",
      priority: "High",
      estimatedTime: "2 to 4 weeks",
      documents: uniqueStrings([
        "Passport",
        "Offer Letter",
        "Proof of Funds",
        "English Test Result",
        ...keyDocuments.slice(0, 4),
      ]),
    });
  }

  if (route === "work") {
    steps.push({
      title: "Strengthen your employability profile",
      description: "Update your CV, align it with your occupation, and prepare for employer applications or sponsorship processes.",
      priority: "High",
      estimatedTime: "1 to 2 weeks",
      documents: uniqueStrings(["CV", "Passport", ...keyDocuments.slice(0, 2)]),
    });

    if (rule?.requiresJobOffer || !profile?.hasJobOffer) {
      steps.push({
        title: "Secure a job offer",
        description: `This route becomes much stronger once you secure a valid job offer in ${rule.country}. Focus on targeted job applications and employer outreach.`,
        priority: "High",
        estimatedTime: "1 to 3 months",
        documents: ["CV", "Cover Letter"],
      });
    }

    if (rule?.requiresEnglishTest) {
      steps.push({
        title: "Meet the language threshold",
        description: "Improve or confirm your English score if the work route requires it.",
        priority: "Medium",
        estimatedTime: "2 to 8 weeks",
        documents: ["English Test Result"],
      });
    }

    steps.push({
      title: "Collect work evidence",
      description: "Prepare employer reference letters, job descriptions, payslips, and experience evidence.",
      priority: "High",
      estimatedTime: "2 to 4 weeks",
      documents: uniqueStrings([
        "Employment Reference Letters",
        "Payslips",
        "CV",
        ...keyDocuments.slice(0, 3),
      ]),
    });

    steps.push({
      title: "Prepare and submit your work visa application",
      description: "Once your work offer and supporting documents are ready, prepare the full visa application accurately.",
      priority: "High",
      estimatedTime: "2 to 4 weeks",
      documents: uniqueStrings([
        "Passport",
        "Job Offer",
        "Work Evidence",
        "English Test Result",
        ...keyDocuments.slice(0, 4),
      ]),
    });
  }

  if (route === "migration") {
    steps.push({
      title: "Strengthen core migration score factors",
      description: "Your strongest migration factors usually include education, work experience, language score, age, and finances. Improve the weakest areas first.",
      priority: "High",
      estimatedTime: "2 to 8 weeks",
      documents: [],
    });

    if (rule?.requiresEnglishTest) {
      steps.push({
        title: "Maximize your English score",
        description: "A stronger English score can materially improve your competitiveness for skilled migration.",
        priority: "High",
        estimatedTime: "2 to 8 weeks",
        documents: ["English Test Result"],
      });
    }

    if (rule?.requiresDegree) {
      steps.push({
        title: "Prepare education evidence",
        description: "Gather degree certificates and transcripts needed to support your migration profile.",
        priority: "High",
        estimatedTime: "1 to 3 weeks",
        documents: uniqueStrings([
          "Degree Certificate",
          "Academic Transcript",
          ...keyDocuments.slice(0, 2),
        ]),
      });
    }

    if (rule?.requiresWorkExperience) {
      steps.push({
        title: "Prepare work experience evidence",
        description: "Collect employment reference letters and work history proof that clearly support your occupation and years of experience.",
        priority: "High",
        estimatedTime: "2 to 4 weeks",
        documents: uniqueStrings([
          "Employment Reference Letters",
          "Payslips",
          "CV",
          ...keyDocuments.slice(0, 3),
        ]),
      });
    }

    if (rule?.requiresFundsProof) {
      steps.push({
        title: "Prepare proof of funds",
        description: "Build a clean, well-documented financial history that can support your migration application.",
        priority: "High",
        estimatedTime: "2 to 6 weeks",
        documents: ["Bank Statements", "Funding Evidence"],
      });
    }

    steps.push({
      title: "Prepare final migration application stage",
      description: "Once your main score factors are improved and your documents are complete, move to the formal application stage for the strongest migration route available.",
      priority: "Medium",
      estimatedTime: "2 to 6 weeks",
      documents: uniqueStrings([
        "Passport",
        "English Test Result",
        "Education Evidence",
        "Work Evidence",
        ...keyDocuments.slice(0, 4),
      ]),
    });
  }

  if (!route) {
    steps.push({
      title: "Improve your weakest profile areas first",
      description: "No strong route stands out yet. Focus on language, funds, work experience, and missing documents before choosing a target country pathway.",
      priority: "High",
      estimatedTime: "1 to 3 months",
      documents: [],
    });
  }

  const nextBestActions = uniqueStrings([
    blockers[0] ? `Fix this first: ${blockers[0]}` : "",
    blockers[1] ? `Then fix: ${blockers[1]}` : "",
    route === "study" ? "Prioritize school admission readiness and finances." : "",
    route === "work" ? "Prioritize employability, job offer readiness, and work evidence." : "",
    route === "migration" ? "Prioritize English score, work evidence, and financial readiness." : "",
  ]).slice(0, 4);

  return {
    country: rule.country,
    pathway,
    readinessScore,
    estimatedTimeline: getEstimatedTimeline(rule, route),
    blockers,
    nextBestActions,
    steps: steps.slice(0, 7),
  };
}