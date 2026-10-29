import { prisma } from "@/lib/db";
import { COUNTRY_PREFIX, type Country } from "@/lib/constants";

/** Atomically generates the next candidate ID for a country, e.g. "PH-000123". */
export async function generateCandidateId(country: Country): Promise<string> {
  const seq = await prisma.$transaction(async (tx) => {
    const existing = await tx.candidateSequence.findUnique({ where: { country } });
    if (!existing) {
      return tx.candidateSequence.create({ data: { country, lastNumber: 1 } });
    }
    return tx.candidateSequence.update({
      where: { country },
      data: { lastNumber: { increment: 1 } },
    });
  });

  const prefix = COUNTRY_PREFIX[country];
  return `${prefix}-${String(seq.lastNumber).padStart(6, "0")}`;
}
