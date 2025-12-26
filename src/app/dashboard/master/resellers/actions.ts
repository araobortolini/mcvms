"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createReseller(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MASTER") {
    throw new Error("Acesso negado");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const credits = parseInt(formData.get("credits") as string) || 0;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "RESELLER",
        credits: credits,
      },
    });

    revalidatePath("/dashboard/master/resellers");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') throw new Error("E-mail já cadastrado");
    throw new Error("Erro ao criar revendedor");
  }
}
