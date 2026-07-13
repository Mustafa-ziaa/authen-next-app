import { auth } from "@/auth";
import { signout } from "@/app/actions/auth.action";
import { LogOut, User, Mail, Shield, Code } from "lucide-react";

const ProfilePage = async () => {
  const session = await auth();

  const userImage = session?.user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
  const userName = session?.user?.name || "Anonymous User";
  const userEmail = session?.user?.email || "No email provided";
  const userId = session?.user?.id || "N/A";

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8 text-zinc-900">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        
        {/* Decorative Top Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative" />

        {/* Profile Content Wrapper */}
        <div className="px-6 pb-8 sm:px-8 sm:pb-10 relative">
          
          {/* Avatar Positioning */}
          <div className="absolute -top-16 left-6 sm:left-8">
            <img 
              className="w-28 h-28 rounded-full border-4 border-white object-cover bg-white shadow-md" 
              src={userImage} 
              alt={`${userName}'s profile`} 
            />
          </div>

          {/* User Meta Data Block */}
          <div className="pt-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{userName}</h1>
              <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1">
                <Shield className="w-4 h-4 text-zinc-400" />
                ID: <span className="font-mono text-xs">{userId}</span>
              </p>
            </div>

            {/* Sign Out Form (Fixed: action passed directly, removed 'await') */}
            <form action={signout}>
              <button 
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-white border border-red-200 hover:border-red-600 hover:bg-red-600 rounded-xl transition-all duration-200 cursor-pointer shadow-sm w-full sm:w-auto"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </form>
          </div>

          <hr className="my-6 border-zinc-200" />

          {/* Information Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Account Details</h2>
            
            <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-150">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Full Name</p>
                <p className="text-sm font-medium text-zinc-800">{userName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-150">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Email Address</p>
                <p className="text-sm font-medium text-zinc-800">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Expandable Debugger Token Section (Pure Server Component Toggle) */}
          <div className="mt-8">
            <details className="group border border-zinc-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-4 bg-zinc-50 cursor-pointer select-none transition-colors hover:bg-zinc-100">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                  <Code className="w-4 h-4 text-zinc-500" />
                  <span>Inspect Auth Session Data</span>
                </div>
                <span className="text-xs text-zinc-400 group-open:hidden">Click to view</span>
                <span className="text-xs text-zinc-400 hidden group-open:inline">Hide</span>
              </summary>
              <div className="p-4 bg-zinc-900 border-t border-zinc-800 overflow-x-auto max-h-60">
                <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            </details>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;