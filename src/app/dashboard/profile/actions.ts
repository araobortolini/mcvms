"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updatePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Não autorizado");

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user || !user.password) throw new Error("Usuário não encontrado");

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) throw new Error("Senha atual incorreta");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword }
  });

  revalidatePath("/dashboard/profile");
}
