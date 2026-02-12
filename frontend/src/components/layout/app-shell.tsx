import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f7f8] text-gray-900">
      <div className="min-h-screen flex">
        <Sidebar />

        <main className="flex-1 min-h-screen flex flex-col">
          <Topbar />
          <div className="flex-1 px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
