type RouteType = "study" | "work" | "migration";

type RouteAssessment = {
  route: RouteType;
  score: number;
  eligible: boolean;
  reasons: string[];
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score));
}

function hasEnoughFunds(profile: any, rule: any) {
  if (!rule.requiresFundsProof) return true;

  const requiredFunds =
    typeof rule.fundsProofAmount === "number" && rule.fundsProofAmount > 0
      ? rule.fundsProofAmount
      : 10000;

  return (profile.savingsAmount || 0) >= requiredFunds;
}

function hasValidEnglish(profile: any, rule: any) {
  if (!rule.requiresEnglishTest) return true;
  if (!profile.englishScore) return false;
  if (typeof rule.minEnglishScore !== "number") return true;

  return profile.englishScore >= rule.minEnglishScore;
}

export function assessRoutes(profile: any, rule: any) {
  const results: RouteAssessment[] = [];

  function evaluateStudy(): RouteAssessment | null {
    if (!rule.studyAvailable) return null;

    let score = 20;
    const reasons: string[] = [];

    if (profile.studyIntent) {
      score += 15;
    } else {
      score -= 10;
      reasons.push("Study is not your stated migration intent");
    }

    if (rule.requiresEnglishTest) {
      if (!hasValidEnglish(profile, rule)) {
        score -= 20;
        reasons.push("English score is too low for study route");
      } else {
        score += 10;
      }
    }

    if (rule.requiresFundsProof) {
      const requiredFunds =
        typeof rule.fundsProofAmount === "number" && rule.fundsProofAmount > 0
          ? rule.fundsProofAmount
          : 10000;

      if (!hasEnoughFunds(profile, rule)) {
        score -= 20;
        reasons.push(
          `Insufficient proof of funds for study route${requiredFunds ? ` (recommended: ${requiredFunds})` : ""}`
        );
      } else {
        score += 10;
      }
    }

    if (!profile.hasDegreeCertificate) {
      score -= 10;
      reasons.push("Missing academic certificate");
    } else {
      score += 5;
    }

    if (!profile.hasTranscript) {
      score -= 8;
      reasons.push("Missing academic transcript");
    } else {
      score += 5;
    }

    if (!profile.hasPassport) {
      score -= 5;
      reasons.push("Passport is missing");
    }

    if (profile.hasScholarshipInterest) {
      score += 5;
    }

    return {
      route: "study",
      score: clampScore(score),
      eligible: clampScore(score) >= 50,
      reasons,
    };
  }

  function evaluateWork(): RouteAssessment | null {
    if (!rule.workAvailable) return null;

    let score = 25;
    const reasons: string[] = [];

    if (rule.requiresWorkExperience) {
      if (!profile.workExperience || profile.workExperience < 2) {
        score -= 20;
        reasons.push("Not enough work experience for work route");
      } else if (profile.workExperience >= 5) {
        score += 20;
      } else if (profile.workExperience >= 3) {
        score += 15;
      } else {
        score += 10;
      }
    }

    if (rule.requiresJobOffer) {
      if (!profile.hasJobOffer) {
        score -= 25;
        reasons.push("Job offer is required but missing");
      } else {
        score += 20;
      }
    } else if (profile.hasJobOffer) {
      score += 12;
    }

    if (rule.requiresEnglishTest) {
      if (!hasValidEnglish(profile, rule)) {
        score -= 15;
        reasons.push("English score is too low for work route");
      } else {
        score += 10;
      }
    }

    if (!profile.hasCv) {
      score -= 10;
      reasons.push("CV is missing");
    } else {
      score += 8;
    }

    if (!profile.hasPassport) {
      score -= 5;
      reasons.push("Passport is missing");
    }

    if (profile.occupation) {
      score += 5;
    }

    return {
      route: "work",
      score: clampScore(score),
      eligible: clampScore(score) >= 50,
      reasons,
    };
  }

  function evaluateMigration(): RouteAssessment | null {
    if (!rule.migrationAvailable) return null;

    let score = 25;
    const reasons: string[] = [];

    if (
      (rule.minAge && profile.age < rule.minAge) ||
      (rule.maxAge && profile.age > rule.maxAge)
    ) {
      score -= 20;
      reasons.push("Age is outside the preferred migration range");
    } else if (profile.age) {
      score += 12;
    }

    if (rule.requiresDegree) {
      if (!profile.hasDegreeCertificate) {
        score -= 20;
        reasons.push("Degree is required for migration route");
      } else {
        score += 12;
      }
    }

    if (rule.requiresWorkExperience) {
      if (!profile.workExperience || profile.workExperience < 3) {
        score -= 20;
        reasons.push("Not enough work experience for migration route");
      } else if (profile.workExperience >= 5) {
        score += 20;
      } else {
        score += 12;
      }
    }

    if (rule.requiresEnglishTest) {
      if (!hasValidEnglish(profile, rule)) {
        score -= 15;
        reasons.push("English score is too low for migration route");
      } else {
        score += 12;
      }
    }

    if (rule.requiresFundsProof) {
      const requiredFunds =
        typeof rule.fundsProofAmount === "number" && rule.fundsProofAmount > 0
          ? rule.fundsProofAmount
          : 10000;

      if (!hasEnoughFunds(profile, rule)) {
        score -= 15;
        reasons.push(
          `Insufficient proof of funds for migration route${requiredFunds ? ` (recommended: ${requiredFunds})` : ""}`
        );
      } else {
        score += 10;
      }
    }

    if (profile.previousVisaRefusal) {
      score -= 10;
      reasons.push("Previous visa refusal may weaken migration route strength");
    }

    if (profile.criminalRecord) {
      score -= 25;
      reasons.push("Criminal record may seriously affect migration eligibility");
    }

    if (!profile.hasPassport) {
      score -= 5;
      reasons.push("Passport is missing");
    }

    return {
      route: "migration",
      score: clampScore(score),
      eligible: clampScore(score) >= 50,
      reasons,
    };
  }

  const study = evaluateStudy();
  const work = evaluateWork();
  const migration = evaluateMigration();

  [study, work, migration].forEach((route) => {
    if (route) results.push(route);
  });

  results.sort((a, b) => b.score - a.score);

  return {
    best: results[0] || null,
    second: results[1] || null,
    all: results,
  };
}