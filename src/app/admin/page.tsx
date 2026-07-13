import { auth } from "@/auth";
import { prisma } from "@/app/utilities/prisma";
import Link from "next/navigation";
import WalletsDashboardClient from "@/app/_components/WalletsDashboardClient";

export default async function WalletsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-slate-500 font-medium">Unauthorized access. Please log in.</p>
      </div>
    );
  }

  // Pure Server database fetch
  const wallets = await prisma.wallet.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });

  return <WalletsDashboardClient initialWallets={wallets} />;
}