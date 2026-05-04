import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col relative pb-20">
      <TopNav user={session.user} />
      <main className="flex-grow overflow-y-auto px-6 pt-4 pb-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
