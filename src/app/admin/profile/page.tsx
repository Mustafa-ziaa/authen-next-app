// src/app/admin/profile/page.tsx
import { auth } from "@/auth";
import { signout } from "@/app/actions/auth.action";
import ProfileClientView from "@/app/admin/profile/ProfileClientView";

export default async function ProfilePage() {
  const session = await auth();

  // تجهيز البيانات القادمة من السيرفر بأمان لتمريرها للـ Client
  const userData = {
    id: session?.user?.id || "N/A",
    name: session?.user?.name || "Anonymous User",
    email: session?.user?.email || "No email provided",
    image: session?.user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  };

  return (
    <ProfileClientView 
      initialUser={userData} 
      sessionRawData={session} 
      signoutAction={signout} 
    />
  );
}