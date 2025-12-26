"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Não autorizado");

  const name = formData.get("name") as string;

  await prisma.category.create({
    data: {
      name,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard/store/categories");
  revalidatePath("/dashboard/store/products");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/dashboard/store/categories");
}
