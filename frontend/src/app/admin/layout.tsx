import { AdminSidebar } from "@/features/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className="flex min-h-screen text-slate-900 selection:bg-rose-500/30"
      style={{
        background: "linear-gradient(135deg, #fff5f7 0%, #fdf2f8 30%, #fff0f3 60%, #fef9ff 100%)",
      }}
    >
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-[1300px] p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
