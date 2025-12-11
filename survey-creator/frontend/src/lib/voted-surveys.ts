const STORAGE_KEY_PREFIX = "voted_surveys_user_";

function getStorageKey(userId: number): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

export function getVotedSurveys(userId: number): number[] {
  try {
    const stored = localStorage.getItem(getStorageKey(userId));
    if (!stored) return [];
    return JSON.parse(stored) as number[];
  } catch {
    return [];
  }
}

export function hasVoted(surveyId: number, userId: number | undefined): boolean {
  if (!userId) return false;
  const voted = getVotedSurveys(userId);
  return voted.includes(surveyId);
}

export function markAsVoted(surveyId: number, userId: number): void {
  const voted = getVotedSurveys(userId);
  if (!voted.includes(surveyId)) {
    voted.push(surveyId);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(voted));
  }
}

