import Link from "next/link";
import type { SessionUser } from "@/lib/auth/session";

type NavItem = { href: string; label: string; roles?: SessionUser["role"][] };

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/candidates", label: "Candidates" },
  { href: "/jobs", label: "Jobs" },
  { href: "/matches", label: "Found Matches", roles: ["ADMIN", "SALES"] },
  { href: "/reports", label: "Reports", roles: ["ADMIN", "MANAGER"] },
  { href: "/admin/users", label: "Users", roles: ["ADMIN"] },
  { href: "/settings", label: "Settings", roles: ["ADMIN"] },
];

export function Sidebar({ user }: { user: SessionUser }) {
  const items = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user.role));

  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div className="px-5 py-5">
        <span className="text-lg font-semibold text-slate-900">Hiring4Less</span>
        <p className="text-xs text-slate-400">Candidate Marketplace CRM</p>
      </div>
      <nav className="flex-1 space-y-0.5 px-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
