"use server"

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function resetPassword(userId: string, newPassword: string) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    revalidatePath("/dashboard/master/resellers");
    return { success: true };
  } catch (error) {
    throw new Error("Erro ao redefinir senha.");
  }
}
