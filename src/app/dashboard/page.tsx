import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardEntryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = session.user.role;
  if (role === "MASTER") redirect("/dashboard/master");
  if (role === "RESELLER") redirect("/dashboard/reseller");
  redirect("/dashboard/store");
}
