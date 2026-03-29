type UserProfile = {
  age?: number;
  educationLevel?: string;
  workExperience?: number;
  englishScore?: number;
  savingsAmount?: number;
};

type CountryRule = {
  minAge?: number | null;
  maxAge?: number | null;
  minEnglishScore?: number | null;
  fundsProofAmount?: number | null;
  requiresDegree?: boolean;
  requiresWorkExperience?: boolean;
};

export function calculateScore(profile: UserProfile, rule: CountryRule) {
  let score = 0;
  const reasons: string[] = [];

  // Age
  if (rule.minAge && profile.age && profile.age < rule.minAge) {
    reasons.push("Age below requirement");
  } else {
    score += 10;
  }

  if (rule.maxAge && profile.age && profile.age > rule.maxAge) {
    reasons.push("Age above limit");
  } else {
    score += 10;
  }

  // English
  if (
    rule.minEnglishScore &&
    (profile.englishScore ?? 0) < rule.minEnglishScore
  ) {
    reasons.push("English score too low");
  } else {
    score += 20;
  }

  // Funds
  if (
    rule.fundsProofAmount &&
    (profile.savingsAmount ?? 0) < rule.fundsProofAmount
  ) {
    reasons.push("Insufficient funds");
  } else {
    score += 20;
  }

  // Degree
  if (rule.requiresDegree && !profile.educationLevel) {
    reasons.push("Degree required");
  } else {
    score += 20;
  }

  // Work Experience
  if (rule.requiresWorkExperience && (profile.workExperience ?? 0) < 1) {
    reasons.push("Work experience required");
  } else {
    score += 20;
  }

  return {
    score,
    reasons,
    eligible: score >= 60,
  };
}