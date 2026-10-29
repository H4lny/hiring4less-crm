import type { Prisma } from "@prisma/client";
import type { SessionUser } from "@/lib/auth/session";

/** Recruiters only see/edit their own candidates (optionally scoped to one country). Admin/Sales/Manager see everything. */
export function candidateWhereForUser(
  user: SessionUser
): Prisma.CandidateWhereInput {
  if (user.role === "RECRUITER") {
    const where: Prisma.CandidateWhereInput = { recruiterId: user.id };
    if (user.countryScope) where.country = user.countryScope;
    return where;
  }
  return {};
}

export function canEditCandidate(
  user: SessionUser,
  candidateRecruiterId: string
): boolean {
  if (user.role === "ADMIN") return true;
  if (user.role === "RECRUITER") return user.id === candidateRecruiterId;
  return false;
}

export function canManageJobsAndMatches(user: SessionUser): boolean {
  return user.role === "ADMIN" || user.role === "SALES";
}
