"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Não autorizado");

  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const categoryId = formData.get("categoryId") as string;
  const stock = Number(formData.get("stock"));
  const minStock = Number(formData.get("minStock"));
  const costPrice = Number(formData.get("costPrice"));
  const salePrice = Number(formData.get("salePrice"));

  await prisma.product.create({
    data: {
      name,
      sku,
      stock,
      minStock,
      costPrice,
      salePrice,
      userId: session.user.id,
      categoryId: categoryId || null,
    },
  });

  revalidatePath("/dashboard/store/products");
}
