export const ROLES = ["ADMIN", "RECRUITER", "SALES", "MANAGER"] as const;
export type Role = (typeof ROLES)[number];

export const COUNTRIES = [
  "PHILIPPINES",
  "DOMINICAN_REPUBLIC",
  "SOUTH_AFRICA",
] as const;
export type Country = (typeof COUNTRIES)[number];

export const COUNTRY_LABELS: Record<Country, string> = {
  PHILIPPINES: "Philippines",
  DOMINICAN_REPUBLIC: "Dominican Republic",
  SOUTH_AFRICA: "South Africa",
};

export const COUNTRY_PREFIX: Record<Country, string> = {
  PHILIPPINES: "PH",
  DOMINICAN_REPUBLIC: "DR",
  SOUTH_AFRICA: "SA",
};

export const ENGLISH_LEVELS = [
  "BASIC",
  "CONVERSATIONAL",
  "FLUENT",
  "NATIVE",
] as const;
export type EnglishLevel = (typeof ENGLISH_LEVELS)[number];

export const AVAILABILITY_OPTIONS = [
  "FULL_TIME",
  "PART_TIME",
  "FLEXIBLE",
] as const;
export type Availability = (typeof AVAILABILITY_OPTIONS)[number];

export const CANDIDATE_STATUSES = [
  "NEW",
  "VETTED",
  "ACTIVE",
  "PLACED",
  "INACTIVE",
  "DO_NOT_USE",
] as const;
export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number];

export const JOB_STATUSES = ["OPEN", "FILLED", "CLOSED", "PAUSED"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_SOURCES = ["GOOGLE_SHEET", "MANUAL", "CSV_IMPORT"] as const;
export type JobSource = (typeof JOB_SOURCES)[number];

export const MATCH_STATUSES = [
  "NEW",
  "VIEWED",
  "EMAIL_PREVIEWED",
  "EMAIL_SENT",
  "DISMISSED",
  "REPLIED",
  "INTERVIEW_SCHEDULED",
  "PLACED",
] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

export const VIDEO_STATUSES = [
  "NONE",
  "PENDING",
  "PROCESSING",
  "READY",
  "FAILED",
] as const;
export type VideoStatus = (typeof VIDEO_STATUSES)[number];

export function labelize(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
