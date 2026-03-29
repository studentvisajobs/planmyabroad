import { assessRoutes } from "@/lib/assessment";

type RecommendationItem = {
  country: string;
  score: number;
  eligible: boolean;
  bestRoute: "study" | "work" | "migration" | null;
  secondRoute: "study" | "work" | "migration" | null;
  reasons: string[];
  strengths: string[];
  weaknesses: string[];
};

type RecommendationResult = {
  topCountry: RecommendationItem | null;
  rankings: RecommendationItem[];
  summary: string;
};

function getStrengths(profile: any, rule: any, best: any) {
  const strengths: string[] = [];

  if (best?.route) {
    strengths.push(`Your strongest pathway here is ${best.route}`);
  }

  if (rule.requiresEnglishTest && profile.englishScore && rule.minEnglishScore) {
    if (profile.englishScore >= rule.minEnglishScore) {
      strengths.push("Your English score meets the current threshold");
    }
  }

  if (profile.workExperience >= 3) {
    strengths.push("Your work experience is competitive");
  }

  if (profile.hasDegreeCertificate) {
    strengths.push("Your academic background is usable for this country");
  }

  if (profile.hasJobOffer) {
    strengths.push("Your job offer improves your options");
  }

  if (rule.requiresFundsProof) {
    const requiredFunds =
      typeof rule.fundsProofAmount === "number" && rule.fundsProofAmount > 0
        ? rule.fundsProofAmount
        : 10000;

    if ((profile.savingsAmount || 0) >= requiredFunds) {
      strengths.push("Your savings look strong enough for proof of funds");
    }
  }

  return strengths.slice(0, 4);
}

function getWeaknesses(profile: any, rule: any, best: any) {
  const weaknesses = [...(best?.reasons || [])];

  if (!profile.hasPassport) {
    weaknesses.push("Passport is missing");
  }

  if (rule.requiresFundsProof) {
    const requiredFunds =
      typeof rule.fundsProofAmount === "number" && rule.fundsProofAmount > 0
        ? rule.fundsProofAmount
        : 10000;

    if ((profile.savingsAmount || 0) < requiredFunds) {
      weaknesses.push("Your available funds may be below the expected level");
    }
  }

  if (rule.requiresEnglishTest && !profile.englishScore) {
    weaknesses.push("You do not have a usable English test score yet");
  }

  return Array.from(new Set(weaknesses)).slice(0, 5);
}

function buildSummary(rankings: RecommendationItem[]) {
  if (rankings.length === 0) {
    return "No country recommendations are available right now.";
  }

  const top = rankings[0];

  if (!top.bestRoute) {
    return `${top.country} is currently your highest-ranked option, but no strong route stands out yet.`;
  }

  return `${top.country} is currently your best option, mainly through the ${top.bestRoute} route.`;
}

export function generateRecommendations(
  profile: any,
  countryRules: any[]
): RecommendationResult {
  const rankings: RecommendationItem[] = countryRules
    .map((rule) => {
      const assessment = assessRoutes(profile, rule);
      const best = assessment?.best ?? null;
      const second = assessment?.second ?? null;

      return {
        country: rule.country,
        score: best?.score ?? 0,
        eligible: best?.eligible ?? false,
        bestRoute: best?.route ?? null,
        secondRoute: second?.route ?? null,
        reasons: best?.reasons ?? [],
        strengths: getStrengths(profile, rule, best),
        weaknesses: getWeaknesses(profile, rule, best),
      };
    })
    .sort((a, b) => b.score - a.score);

  return {
    topCountry: rankings[0] ?? null,
    rankings,
    summary: buildSummary(rankings),
  };
}