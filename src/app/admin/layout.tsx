// app/admin/layout.tsx (or page.tsx)
import { auth } from "@/auth"; // Your Auth.js / NextAuth config path
import Sidebar from "@/app/_components/Sidebar"
import Header from "@/app/_components/Header";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  // Extract user details with fallbacks if data is missing
  const user = {
    name: session?.user?.name || "Admin User",
    email: session?.user?.email || "admin@example.com",
    image: session?.user?.image || "", // URL string
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar - Desktop */}
      <Sidebar user={user} />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header user={user} />
        
        {/* Main Content View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}