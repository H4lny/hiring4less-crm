import type { SessionUser } from "@/lib/auth/session";
import { logoutAction } from "@/app/(app)/logout-action";
import { labelize } from "@/lib/constants";

export function Topbar({ user }: { user: SessionUser }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div className="text-sm text-slate-500">
        Signed in as <span className="font-medium text-slate-800">{user.name}</span>{" "}
        <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
          {labelize(user.role)}
        </span>
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          Sign out
        </button>
      </form>
    </header>
  );
}
