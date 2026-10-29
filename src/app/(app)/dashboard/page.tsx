import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { COUNTRY_LABELS, labelize, type Country } from "@/lib/constants";

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();

  const [
    totalCandidates,
    candidatesByCountryRaw,
    candidatesByRoleRaw,
    newLast7Days,
    jobsImported,
    matchesFound,
    emailsSent,
    replies,
    interviews,
    placements,
  ] = await Promise.all([
    prisma.candidate.count(),
    prisma.candidate.groupBy({ by: ["country"], _count: { _all: true } }),
    prisma.candidate.groupBy({ by: ["jobTitle"], _count: { _all: true }, orderBy: { _count: { jobTitle: "desc" } }, take: 5 }),
    prisma.candidate.count({ where: { dateAdded: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    prisma.job.count(),
    prisma.match.count(),
    prisma.emailLog.count({ where: { status: "SENT" } }),
    prisma.match.count({ where: { status: "REPLIED" } }),
    prisma.match.count({ where: { status: "INTERVIEW_SCHEDULED" } }),
    prisma.match.count({ where: { status: "PLACED" } }),
  ]);

  const byCountry = candidatesByCountryRaw as unknown as { country: Country; _count: { _all: number } }[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Welcome, {user.name}</h1>
        <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening across the marketplace.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Candidates" value={totalCandidates} />
        <StatCard label="New (7 days)" value={newLast7Days} />
        <StatCard label="Jobs Imported" value={jobsImported} />
        <StatCard label="AI Matches Found" value={matchesFound} />
        <StatCard label="Emails Sent" value={emailsSent} />
        <StatCard label="Replies" value={replies} />
        <StatCard label="Interviews Scheduled" value={interviews} />
        <StatCard label="Placements" value={placements} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-800">Candidates by Country</h2>
          <div className="mt-3 space-y-2">
            {byCountry.length === 0 && <p className="text-sm text-slate-400">No candidates yet.</p>}
            {byCountry.map((row) => (
              <div key={row.country} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{COUNTRY_LABELS[row.country] ?? row.country}</span>
                <span className="font-medium text-slate-900">{row._count._all}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-800">Top Roles</h2>
          <div className="mt-3 space-y-2">
            {candidatesByRoleRaw.length === 0 && <p className="text-sm text-slate-400">No candidates yet.</p>}
            {candidatesByRoleRaw.map((row) => (
              <div key={row.jobTitle} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{labelize(row.jobTitle)}</span>
                <span className="font-medium text-slate-900">{row._count._all}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
