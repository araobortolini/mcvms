"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Não autorizado");

  const name = formData.get("name") as string;
  const primaryColor = formData.get("primaryColor") as string;
  const logoUrl = formData.get("logoUrl") as string;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      primaryColor,
      logoUrl,
    },
  });

  revalidatePath("/dashboard");
}
